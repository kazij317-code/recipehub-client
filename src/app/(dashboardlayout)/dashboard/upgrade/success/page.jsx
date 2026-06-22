import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import SuccessClient from "./SuccessClient";

const SuccessPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams?.session_id || "";
  const type = resolvedSearchParams?.type || "";
  const recipeId = resolvedSearchParams?.recipeId || "";
  const isRecipePurchase = type === "recipe_purchase";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.email) {
    try {
      const db = await getDb();
      if (isRecipePurchase && recipeId) {
        // Record the recipe purchase in the database
        const purchasesCollection = db.collection("purchases");
        await purchasesCollection.updateOne(
          {
            userEmail: session.user.email,
            recipeId: recipeId,
          },
          {
            $set: {
              userId: session.user.id,
              userEmail: session.user.email,
              recipeId: recipeId,
              paymentType: "recipe_purchase",
              sessionId: sessionId,
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
        console.log(`[SUCCESS] Recorded purchase of recipe ${recipeId} for ${session.user.email}`);
      } else {
        // Upgrade user to premium (original logic)
        const usersCollection = db.collection("user");
        await usersCollection.updateOne(
          { email: session.user.email },
          {
            $set: {
              plan: "premium",
              isPremium: true,
              limit: -1, // Unlimited
            },
          }
        );

        // Record the premium upgrade transaction
        const purchasesCollection = db.collection("purchases");
        await purchasesCollection.updateOne(
          {
            userEmail: session.user.email,
            paymentType: "premium_upgrade",
            sessionId: sessionId,
          },
          {
            $set: {
              userId: session.user.id,
              userEmail: session.user.email,
              paymentType: "premium_upgrade",
              sessionId: sessionId,
              amount: "$9.99",
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
        console.log(`[SUCCESS] Upgraded user ${session.user.email} to premium and logged transaction.`);
      }
    } catch (error) {
      console.error("[SUCCESS] Failed database operation on success:", error);
    }
  }

  return (
    <div className="py-10 px-4 md:px-10">
      <SuccessClient />
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold">Payment Successful! 🎉</h1>
          <p className="text-slate-500 mt-3">
            {isRecipePurchase
              ? "Your recipe has been unlocked! You can now access the full recipe details."
              : "Welcome to RecipeHub Premium! You now have unlimited recipe uploads and your premium badge is active."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 mt-6 dark:border-zinc-800 dark:bg-zinc-900 max-w-md mx-auto text-left">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Payment Type</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {isRecipePurchase ? "🔍 Recipe Purchase" : "Premium Membership"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-xs font-semibold dark:bg-emerald-950/30 dark:text-emerald-400">
                ✓ Completed
              </span>
            </div>
            {sessionId && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Session</span>
                <span className="font-mono text-xs text-slate-600 dark:text-slate-300 truncate max-w-[200px]" title={sessionId}>
                  {sessionId}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Link href="/dashboard" className="rounded-full bg-slate-900 px-6 py-3 text-white">
            Go to Dashboard →
          </Link>
          <Link href="/browse-recipes" className="rounded-full border border-slate-200 px-6 py-3">
            Browse Recipes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
