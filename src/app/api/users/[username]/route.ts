import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { id: username }],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        location: true,
        isVerified: true,
        createdAt: true,
        hostedEvents: {
          where: { status: { in: ["ACTIVE", "COMPLETED"] } },
          include: { _count: { select: { attendances: true } } },
          orderBy: { createdAt: "desc" },
          take: 12,
        },
        tagAlongPosts: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 6,
        },
        talkAlongPosts: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 6,
        },
        _count: {
          select: {
            hostedEvents: true,
            attendances: true,
            tagAlongPosts: true,
            talkAlongPosts: true,
          },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, username, bio, location, image } = body;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, username, bio, location, image },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
