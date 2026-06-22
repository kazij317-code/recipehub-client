import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { message: "Invalid signature" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const usersCollection = db.collection("user");

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const userEmail = session.metadata?.userEmail;
    const recipeId = session.metadata?.recipeId;
    const paymentType = session.metadata?.paymentType;

    if (paymentType === "recipe_purchase" && recipeId && (userId || userEmail)) {
      try {
        const purchasesCollection = db.collection("purchases");
        await purchasesCollection.updateOne(
          {
            userEmail: userEmail,
            recipeId: recipeId,
          },
          {
            $set: {
              userId: userId,
              userEmail: userEmail,
              recipeId: recipeId,
              paymentType: "recipe_purchase",
              sessionId: session.id,
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
        console.log(`User ${userEmail || userId} purchased recipe ${recipeId}`);
      } catch (error) {
        console.error("Failed to record recipe purchase:", error);
        return NextResponse.json(
          { message: "Failed to record purchase" },
          { status: 500 }
        );
      }
    } else if (userId || userEmail) {
      try {
        const query = userEmail ? { email: userEmail } : { _id: userId };
        // Update user to premium
        await usersCollection.updateOne(
          query,
          {
            $set: {
              plan: "premium",
              isPremium: true,
              limit: -1, // Unlimited
            },
          }
        );

        // Record the transaction
        const purchasesCollection = db.collection("purchases");
        const resolvedEmail = userEmail || (await usersCollection.findOne(query))?.email;
        await purchasesCollection.updateOne(
          {
            userEmail: resolvedEmail,
            paymentType: "premium_upgrade",
            sessionId: session.id,
          },
          {
            $set: {
              userId: userId,
              userEmail: resolvedEmail,
              paymentType: "premium_upgrade",
              sessionId: session.id,
              amount: "$9.99",
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );

        console.log(`User ${resolvedEmail || userId} upgraded to premium and transaction logged`);
      } catch (error) {
        console.error("Failed to update user plan or record transaction:", error);
        return NextResponse.json(
          { message: "Failed to update user or record transaction" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json(
    { message: "Webhook endpoint" },
    { status: 405 }
  );
}
