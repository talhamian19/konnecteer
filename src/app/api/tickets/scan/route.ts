import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { qrCode, eventId } = await req.json();

    const ticket = await prisma.ticket.findFirst({
      where: { qrCode, eventId },
      include: { user: { select: { name: true } } },
    });

    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    if (ticket.status === "USED") return NextResponse.json({ error: "Ticket already used" }, { status: 400 });
    if (ticket.status !== "VALID") return NextResponse.json({ error: `Ticket is ${ticket.status}` }, { status: 400 });

    // Verify host
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.hostId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to scan this event" }, { status: 403 });
    }

    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: "USED", scannedAt: new Date(), scannedBy: session.user.id },
    });

    return NextResponse.json({ success: true, user: ticket.user.name || "Guest" });
  } catch (error) {
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
