import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = 12;
    const type = searchParams.get("type") || "all"; // all | events | tag-along | talk-along
    const category = searchParams.get("category");
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");

    const items: Array<{ type: string; data: unknown; score: number; createdAt: Date }> = [];

    if (type === "all" || type === "events") {
      const events = await prisma.event.findMany({
        where: {
          status: "ACTIVE",
          startTime: { gte: new Date() },
          ...(category ? { category: category as never } : {}),
        },
        include: {
          host: { select: { id: true, name: true, image: true, username: true, isVerified: true } },
          media: { orderBy: { order: "asc" }, take: 1 },
          hashtags: { include: { hashtag: true }, take: 5 },
          _count: { select: { attendances: true } },
        },
        orderBy: [{ isBoosted: "desc" }, { rankScore: "desc" }, { createdAt: "desc" }],
        take: limit,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      });
      events.forEach((e) => items.push({ type: "event", data: e, score: e.rankScore + (e.isBoosted ? 1000 : 0), createdAt: e.createdAt }));
    }

    if (type === "all" || type === "tag-along") {
      const tagAlongs = await prisma.tagAlongPost.findMany({
        where: {
          status: "ACTIVE",
          scheduledAt: { gte: new Date() },
          ...(category ? { category: category as never } : {}),
        },
        include: {
          creator: { select: { id: true, name: true, image: true, username: true, isVerified: true } },
          hashtags: { include: { hashtag: true }, take: 5 },
          _count: { select: { requests: true } },
        },
        orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
        take: limit,
      });
      tagAlongs.forEach((t) => items.push({ type: "tagAlong", data: t, score: t.rankScore, createdAt: t.createdAt }));
    }

    if (type === "all" || type === "talk-along") {
      const talkAlongs = await prisma.talkAlongPost.findMany({
        where: { status: "ACTIVE" },
        include: {
          creator: { select: { id: true, name: true, image: true, username: true, isVerified: true } },
          hashtags: { include: { hashtag: true }, take: 5 },
          _count: { select: { requests: true } },
        },
        orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
        take: limit,
      });
      talkAlongs.forEach((t) => items.push({ type: "talkAlong", data: t, score: t.rankScore, createdAt: t.createdAt }));
    }

    // Sort by score desc
    items.sort((a, b) => b.score - a.score);
    const page = items.slice(0, limit);

    return NextResponse.json({ items: page, hasMore: items.length > limit });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}
