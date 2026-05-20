import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { chatId } = await params;
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = 30;

    // Verify membership
    const member = await prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId, userId: session.user.id } },
    });
    if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const messages = await prisma.chatMessage.findMany({
      where: { chatId, isDeleted: false },
      include: {
        sender: { select: { id: true, name: true, image: true, username: true } },
        replyTo: {
          include: { sender: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop();

    return NextResponse.json({ messages: messages.reverse(), hasMore });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { chatId } = await params;
    const { content, mediaUrl, replyToId } = await req.json();

    const member = await prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId, userId: session.user.id } },
    });
    if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const message = await prisma.chatMessage.create({
      data: {
        chatId,
        senderId: session.user.id,
        content,
        mediaUrl,
        replyToId,
      },
      include: {
        sender: { select: { id: true, name: true, image: true, username: true } },
        replyTo: { include: { sender: { select: { id: true, name: true } } } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
