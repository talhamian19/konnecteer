import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// Get all chats for current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const chats = await prisma.chat.findMany({
      where: {
        members: { some: { userId: session.user.id } },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, image: true, username: true } } },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { id: true, name: true } } },
        },
        event: { select: { id: true, title: true, coverImage: true } },
        tagAlong: { select: { id: true, title: true } },
        talkAlong: { select: { id: true, title: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Create private chat
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { targetUserId } = await req.json();

    // Check if private chat already exists
    const existing = await prisma.chat.findFirst({
      where: {
        type: "PRIVATE",
        members: {
          every: { userId: { in: [session.user.id, targetUserId] } },
        },
      },
      include: { members: true },
    });

    if (existing && existing.members.length === 2) return NextResponse.json(existing);

    const chat = await prisma.chat.create({
      data: {
        type: "PRIVATE",
        members: {
          create: [
            { userId: session.user.id },
            { userId: targetUserId },
          ],
        },
      },
      include: { members: { include: { user: { select: { id: true, name: true, image: true, username: true } } } } },
    });

    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
