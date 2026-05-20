import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await prisma.event.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => null);

    const full = await prisma.event.findUnique({
      where: { id },
      include: {
        host: true,
        media: { orderBy: { order: "asc" } },
        attendances: {
          include: { user: { select: { id: true, name: true, image: true, username: true } } },
          take: 20,
        },
        hashtags: { include: { hashtag: true } },
        chat: { select: { id: true } },
        _count: { select: { attendances: true } },
      },
    });

    if (!full) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(full);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event || event.hostId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await prisma.event.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event || event.hostId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.event.update({ where: { id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
