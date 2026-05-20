import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      include: {
        event: {
          include: { host: { select: { id: true, name: true, image: true } } },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
