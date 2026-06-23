"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import Stripe from "stripe";
import { getDb } from "../db";
import { ObjectId } from "mongodb";

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

export async function createRecipeCheckoutAction(recipeId) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  if (!recipeId) {
    throw new Error("Recipe ID is required");
  }

  // Check if already purchased to prevent double-purchasing
  const db = await getDb();
  const purchasesCollection = db.collection("purchases");
  const possibleIds = [recipeId];
  try {
    possibleIds.push(new ObjectId(recipeId));
  } catch (e) {}

  const existing = await purchasesCollection.findOne({
    userEmail: session.user.email,
    recipeId: { $in: possibleIds },
  });

  if (existing) {
    throw new Error("You have already purchased this recipe.");
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1Tl3tfDihrCrwhWnsdBjlq3o",
          quantity: 1,
        },
      ],
      success_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/dashboard/upgrade/success?session_id={CHECKOUT_SESSION_ID}&type=recipe_purchase&recipeId=${recipeId}`,
      cancel_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/browse-recipes/${recipeId}`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
        recipeId: recipeId,
        paymentType: "recipe_purchase",
      },
    });

    return { url: checkoutSession.url };
  } catch (error) {
    console.error("Stripe error in recipe checkout action:", error);
    throw new Error(error.message || "Failed to create recipe checkout session");
  }
}

