import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const hostId = searchParams.get("hostId");
    const limit = parseInt(searchParams.get("limit") || "20");

    const events = await prisma.event.findMany({
      where: {
        status: { in: ["ACTIVE", "COMPLETED"] },
        ...(category ? { category: category as never } : {}),
        ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
        ...(hostId ? { hostId } : {}),
      },
      include: {
        host: { select: { id: true, name: true, image: true, username: true, isVerified: true } },
        media: { orderBy: { order: "asc" }, take: 1 },
        _count: { select: { attendances: true } },
      },
      orderBy: [{ isBoosted: "desc" }, { rankScore: "desc" }, { startTime: "asc" }],
      take: limit,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      title, description, location, address, latitude, longitude,
      startTime, endTime, category, price, isFree, maxAttendees,
      coverImage, hashtags,
    } = body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        hostId: session.user.id,
        location,
        address,
        latitude,
        longitude,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : undefined,
        category: category || "OTHER",
        price: price || 0,
        isFree: isFree !== false,
        maxAttendees,
        coverImage,
        status: "ACTIVE",
      },
    });

    // Add hashtags
    if (hashtags?.length) {
      for (const tag of hashtags) {
        const hashtag = await prisma.hashtag.upsert({
          where: { tag: tag.toLowerCase() },
          create: { tag: tag.toLowerCase(), useCount: 1 },
          update: { useCount: { increment: 1 } },
        });
        await prisma.eventHashtag.create({
          data: { eventId: event.id, hashtagId: hashtag.id },
        });
      }
    }

    // Auto-create chat for event
    await prisma.chat.create({
      data: {
        type: "EVENT",
        eventId: event.id,
        members: { create: { userId: session.user.id, isAdmin: true } },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
