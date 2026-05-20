import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const type = searchParams.get("type") || "all";

    if (!q || q.length < 2) return NextResponse.json({ events: [], users: [], hashtags: [], tagAlongs: [], talkAlongs: [] });

    const [events, users, hashtags, tagAlongs, talkAlongs] = await Promise.all([
      (type === "all" || type === "events")
        ? prisma.event.findMany({
            where: {
              status: "ACTIVE",
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { location: { contains: q, mode: "insensitive" } },
              ],
            },
            include: { host: { select: { id: true, name: true, image: true } }, _count: { select: { attendances: true } } },
            take: 8,
          })
        : [],
      (type === "all" || type === "users")
        ? prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { username: { contains: q, mode: "insensitive" } },
              ],
            },
            select: { id: true, name: true, username: true, image: true, isVerified: true, bio: true },
            take: 8,
          })
        : [],
      (type === "all" || type === "hashtags")
        ? prisma.hashtag.findMany({
            where: { tag: { contains: q.replace("#", ""), mode: "insensitive" } },
            orderBy: { useCount: "desc" },
            take: 8,
          })
        : [],
      (type === "all" || type === "tag-along")
        ? prisma.tagAlongPost.findMany({
            where: {
              status: "ACTIVE",
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { activity: { contains: q, mode: "insensitive" } },
              ],
            },
            include: { creator: { select: { id: true, name: true, image: true } } },
            take: 8,
          })
        : [],
      (type === "all" || type === "talk-along")
        ? prisma.talkAlongPost.findMany({
            where: {
              status: "ACTIVE",
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { topic: { contains: q, mode: "insensitive" } },
              ],
            },
            include: { creator: { select: { id: true, name: true, image: true } } },
            take: 8,
          })
        : [],
    ]);

    return NextResponse.json({ events, users, hashtags, tagAlongs, talkAlongs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
