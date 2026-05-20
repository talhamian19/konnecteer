import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const creatorId = searchParams.get("creatorId");

    const posts = await prisma.tagAlongPost.findMany({
      where: {
        status: "ACTIVE",
        scheduledAt: { gte: new Date() },
        ...(category ? { category: category as never } : {}),
        ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { activity: { contains: q, mode: "insensitive" } }] } : {}),
        ...(creatorId ? { creatorId } : {}),
      },
      include: {
        creator: { select: { id: true, name: true, image: true, username: true, isVerified: true } },
        _count: { select: { requests: true } },
      },
      orderBy: [{ rankScore: "desc" }, { scheduledAt: "asc" }],
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
    const { title, description, location, latitude, longitude, activity, scheduledAt, maxPeople, vibeTags, category, hashtags } = body;

    const post = await prisma.tagAlongPost.create({
      data: {
        creatorId: session.user.id,
        title,
        description,
        location,
        latitude,
        longitude,
        activity,
        scheduledAt: new Date(scheduledAt),
        maxPeople,
        vibeTags: vibeTags || [],
        category: category || "OTHER",
        status: "ACTIVE",
      },
    });

    if (hashtags?.length) {
      for (const tag of hashtags) {
        const hashtag = await prisma.hashtag.upsert({
          where: { tag: tag.toLowerCase() },
          create: { tag: tag.toLowerCase(), useCount: 1 },
          update: { useCount: { increment: 1 } },
        });
        await prisma.tagAlongHashtag.create({ data: { postId: post.id, hashtagId: hashtag.id } });
      }
    }

    // Auto-create chat
    await prisma.chat.create({
      data: {
        type: "TAG_ALONG",
        tagAlongPostId: post.id,
        members: { create: { userId: session.user.id, isAdmin: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
