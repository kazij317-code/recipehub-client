import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Stripe from "stripe";
import { getDb } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  console.log("[DEBUG] create-checkout-session: Auth Header =", authHeader);

  const session = await auth.api.getSession({ request });
  console.log("[DEBUG] create-checkout-session: Session =", session);
  
  if (!session || !session.user) {
    console.log("[DEBUG] create-checkout-session: Returning 401 Unauthorized");
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { userId } = await request.json();
  
  if (!userId || userId !== session.user.id) {
    return NextResponse.json(
      { message: "Invalid user ID" },
      { status: 400 }
    );
  }

  try {
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1Tkrg0DihrCrwhWnCxl8MJTS",
          quantity: 1,
        },
      ],
      success_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/dashboard/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/dashboard/upgrade`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
        paymentType: "premium_upgrade",
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { message: "Failed to create checkout session", error: error.message },
      { status: 500 }
    );
  }
}
