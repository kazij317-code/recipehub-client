"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSessionAction(userId) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  if (!userId || userId !== session.user.id) {
    throw new Error("Invalid user ID");
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
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
      },
    });

    return { url: checkoutSession.url };
  } catch (error) {
    console.error("Stripe error in action:", error);
    throw new Error(error.message || "Failed to create checkout session");
  }
}
