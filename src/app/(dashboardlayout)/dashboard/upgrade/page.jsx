"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Apple } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { createCheckoutSessionAction } from "@/lib/actions/checkout";

const UpgradePage = () => {
  const router = useRouter();
  const session = authClient.useSession();
  const user = session.data?.user || null;
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (!user?.id) {
      router.push("/dashboard/profile");
      return;
    }

    setLoading(true);
    try {
      const data = await createCheckoutSessionAction(user.id);
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("Could not create checkout session");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold mb-4">Choose a currency:</h2>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <button className="rounded-xl border border-slate-200 p-4 text-left bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">BDT</div>
                  <div className="font-bold">BDT 1,277.61</div>
                </div>
                <div className="text-xs text-slate-400">1 USD = 127.8889 BDT</div>
              </div>
            </button>
            <button className="rounded-xl border border-slate-200 p-4 text-left bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">USD</div>
                  <div className="font-bold">$9.99</div>
                </div>
              </div>
            </button>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-500">RecipeHub Premium Membership</div>
            <div className="font-semibold">BDT 1,277.61</div>
            <p className="text-xs text-slate-400 mt-2">Unlimited recipe uploads + premium badge</p>
          </div>

          <button
            onClick={handleProceed}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Redirecting to Stripe…" : "Proceed to checkout"}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold mb-4">Payment</h3>
          <div className="flex gap-3">
            <div className="rounded-lg border p-3 flex-1 text-center"> <Apple className="mx-auto"/> Apple Pay</div>
            <div className="rounded-lg border p-3 flex-1 text-center"> <CreditCard className="mx-auto"/> Card</div>
          </div>

          <p className="text-xs text-slate-500 mt-4">This is a demo flow. Real payment integration requires server-side Stripe calls.</p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
