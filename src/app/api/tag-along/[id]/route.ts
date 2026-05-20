import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.tagAlongPost.findUnique({
      where: { id },
      include: {
        creator: true,
        requests: {
          include: { user: { select: { id: true, name: true, image: true, username: true } } },
        },
        hashtags: { include: { hashtag: true } },
        chat: { select: { id: true } },
        _count: { select: { requests: true } },
      },
    });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
