import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { eventId } = await params;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.hostId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [attendances, tickets, revenue] = await Promise.all([
      prisma.eventAttendance.findMany({
        where: { eventId },
        include: { user: { select: { id: true, name: true, image: true, username: true, createdAt: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.ticket.findMany({
        where: { eventId },
        include: { user: { select: { id: true, name: true } }, payment: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.aggregate({
        where: { tickets: { some: { eventId } }, status: "COMPLETED" },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const scanStats = {
      total: tickets.length,
      used: tickets.filter((t) => t.status === "USED").length,
      valid: tickets.filter((t) => t.status === "VALID").length,
    };

    // Attendance over time (last 7 days)
    const now = new Date();
    const timeline = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toISOString().split("T")[0];
      return {
        date: dayStr,
        count: attendances.filter((a) => a.createdAt.toISOString().split("T")[0] === dayStr).length,
      };
    });

    return NextResponse.json({
      event: { ...event, _count: { attendances: attendances.length } },
      attendances,
      tickets,
      revenue: revenue._sum.amount || 0,
      revenueCount: revenue._count,
      scanStats,
      timeline,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
