import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
  return (
    <div className="py-10 px-4 md:px-10">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold">Payment Successful! 🎉</h1>
          <p className="text-slate-500 mt-3">Welcome to RecipeHub Premium! You now have unlimited recipe uploads and your premium badge is active.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 mt-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-slate-500">Payment Type</div>
              <div className="font-semibold">Premium Membership</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Status</div>
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">✓ Completed</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Link href="/dashboard" className="rounded-full bg-slate-900 px-6 py-3 text-white">Go to Dashboard →</Link>
          <Link href="/browse-recipes" className="rounded-full border border-slate-200 px-6 py-3">Browse Recipes</Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
