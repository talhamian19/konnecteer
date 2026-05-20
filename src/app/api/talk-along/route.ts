import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const creatorId = searchParams.get("creatorId");

    const posts = await prisma.talkAlongPost.findMany({
      where: {
        status: "ACTIVE",
        ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { topic: { contains: q, mode: "insensitive" } }] } : {}),
        ...(creatorId ? { creatorId } : {}),
      },
      include: {
        creator: { select: { id: true, name: true, image: true, username: true, isVerified: true } },
        _count: { select: { requests: true } },
      },
      orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
      take: 20,
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, topic, hashtags } = body;

    const post = await prisma.talkAlongPost.create({
      data: {
        creatorId: session.user.id,
        title,
        description,
        topic,
        status: "ACTIVE",
        memberCount: 1,
      },
    });

    if (hashtags?.length) {
      for (const tag of hashtags) {
        const hashtag = await prisma.hashtag.upsert({
          where: { tag: tag.toLowerCase() },
          create: { tag: tag.toLowerCase(), useCount: 1 },
          update: { useCount: { increment: 1 } },
        });
        await prisma.talkAlongHashtag.create({ data: { postId: post.id, hashtagId: hashtag.id } });
      }
    }

    // Auto-create chat
    await prisma.chat.create({
      data: {
        type: "TALK_ALONG",
        talkAlongPostId: post.id,
        members: { create: { userId: session.user.id, isAdmin: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
