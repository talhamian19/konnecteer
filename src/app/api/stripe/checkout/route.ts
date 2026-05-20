import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "placeholder", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { eventId, quantity = 1 } = await req.json();

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { host: true },
    });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    if (event.isFree) return NextResponse.json({ error: "Event is free" }, { status: 400 });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: event.title,
              description: event.description.slice(0, 255),
              images: event.coverImage ? [event.coverImage] : [],
            },
            unit_amount: Math.round(event.price * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/tickets?success=1&eventId=${eventId}`,
      cancel_url: `${baseUrl}/explore/${eventId}?cancelled=1`,
      metadata: {
        eventId,
        userId: session.user.id,
        quantity: String(quantity),
      },
    });

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        stripeSessionId: checkoutSession.id,
        amount: event.price * quantity,
        currency: "usd",
        status: "PENDING",
      },
    });

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
