import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "placeholder", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { eventId, userId, quantity } = session.metadata!;
    const qty = parseInt(quantity);

    try {
      // Update payment status
      await prisma.payment.updateMany({
        where: { stripeSessionId: session.id },
        data: {
          status: "COMPLETED",
          stripePaymentId: session.payment_intent as string,
        },
      });

      const payment = await prisma.payment.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (payment) {
        // Create tickets
        const tickets = [];
        for (let i = 0; i < qty; i++) {
          tickets.push({ eventId, userId, paymentId: payment.id });
        }
        await prisma.ticket.createMany({ data: tickets });

        // Auto-add to event attendance
        await prisma.eventAttendance.upsert({
          where: { eventId_userId: { eventId, userId } },
          create: { eventId, userId },
          update: {},
        });

        // Add to event chat
        const chat = await prisma.chat.findUnique({ where: { eventId } });
        if (chat) {
          await prisma.chatMember.upsert({
            where: { chatId_userId: { chatId: chat.id, userId } },
            create: { chatId: chat.id, userId },
            update: {},
          });
        }

        // Notify user
        const ev = await prisma.event.findUnique({ where: { id: eventId } });
        if (ev) {
          await prisma.notification.create({
            data: {
              userId,
              type: "TICKET_PURCHASED",
              title: "Ticket Confirmed!",
              message: `Your ticket for "${ev.title}" has been confirmed.`,
              data: { eventId, ticketCount: qty },
            },
          });
        }
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } };
