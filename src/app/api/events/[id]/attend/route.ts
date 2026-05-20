import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const existing = await prisma.eventAttendance.findUnique({
      where: { eventId_userId: { eventId: id, userId: session.user.id } },
    });

    if (existing) {
      // Toggle off
      await prisma.eventAttendance.delete({
        where: { eventId_userId: { eventId: id, userId: session.user.id } },
      });
      // Remove from chat
      const chat = await prisma.chat.findUnique({ where: { eventId: id } });
      if (chat) {
        await prisma.chatMember.deleteMany({ where: { chatId: chat.id, userId: session.user.id } });
      }
      return NextResponse.json({ attending: false });
    }

    // Check capacity
    if (event.maxAttendees) {
      const count = await prisma.eventAttendance.count({ where: { eventId: id } });
      if (count >= event.maxAttendees) {
        return NextResponse.json({ error: "Event is full" }, { status: 400 });
      }
    }

    await prisma.eventAttendance.create({
      data: { eventId: id, userId: session.user.id },
    });

    // Add to event chat
    const chat = await prisma.chat.findUnique({ where: { eventId: id } });
    if (chat) {
      await prisma.chatMember.upsert({
        where: { chatId_userId: { chatId: chat.id, userId: session.user.id } },
        create: { chatId: chat.id, userId: session.user.id },
        update: {},
      });
    }

    // Update rank score
    await prisma.event.update({
      where: { id },
      data: { rankScore: { increment: 2 } },
    });

    return NextResponse.json({ attending: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
