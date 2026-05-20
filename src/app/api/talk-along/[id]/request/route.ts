import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const post = await prisma.talkAlongPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (post.creatorId === session.user.id) {
      return NextResponse.json({ error: "Cannot request own post" }, { status: 400 });
    }

    const existing = await prisma.talkAlongRequest.findUnique({
      where: { postId_userId: { postId: id, userId: session.user.id } },
    });
    if (existing) return NextResponse.json({ error: "Already requested" }, { status: 400 });

    const request = await prisma.talkAlongRequest.create({
      data: { postId: id, userId: session.user.id, status: "PENDING" },
    });

    await prisma.notification.create({
      data: {
        userId: post.creatorId,
        type: "JOIN_REQUEST",
        title: "New Join Request",
        message: `Someone wants to join your talk along: ${post.title}`,
        data: { postId: id, requestId: request.id, type: "talk-along" },
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { requestId, status } = body;

    const post = await prisma.talkAlongPost.findUnique({ where: { id } });
    if (!post || post.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const request = await prisma.talkAlongRequest.update({
      where: { id: requestId },
      data: { status },
    });

    if (status === "ACCEPTED") {
      const chat = await prisma.chat.findUnique({ where: { talkAlongPostId: id } });
      if (chat) {
        await prisma.chatMember.upsert({
          where: { chatId_userId: { chatId: chat.id, userId: request.userId } },
          create: { chatId: chat.id, userId: request.userId },
          update: {},
        });
      }
      await prisma.talkAlongPost.update({ where: { id }, data: { memberCount: { increment: 1 } } });
    }

    await prisma.notification.create({
      data: {
        userId: request.userId,
        type: status === "ACCEPTED" ? "REQUEST_ACCEPTED" : "REQUEST_DECLINED",
        title: status === "ACCEPTED" ? "Request Accepted!" : "Request Declined",
        message: status === "ACCEPTED"
          ? `Your request to join "${post.title}" was accepted!`
          : `Your request to join "${post.title}" was declined.`,
        data: { postId: id, type: "talk-along" },
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
