import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const hashtags = await prisma.hashtag.findMany({
      orderBy: { useCount: "desc" },
      take: 15,
    });
    return NextResponse.json(hashtags);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
