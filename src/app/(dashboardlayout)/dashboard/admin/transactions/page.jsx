"use client";

import React, { useEffect, useState } from "react";
import { fetchAllTransactionsAdmin } from "@/lib/actions/admin";
import { Crown, Search } from "lucide-react";
import toast from "react-hot-toast";

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchAllTransactionsAdmin();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions:", error);
        toast.error("Failed to fetch transaction logs.");
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  if (loading) {
    return (
      <div className="py-10 px-4 md:px-10 text-center">
        <p className="text-lg text-slate-700 dark:text-slate-300 animate-pulse">
          Loading payment ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-10 px-4 md:px-10 bg-slate-50/50 dark:bg-zinc-950/20 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          Transactions 💳
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          All payment records on the platform
        </p>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {transactions.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-500 dark:text-slate-400">No payment transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  User
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Type
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Amount
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {transactions.map((t, index) => {
                const paidDate = t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("en-GB")
                  : "16/06/2026";
                const isPremium = t.paymentType === "premium_upgrade";
                const amount = t.amount || (isPremium ? "$9.99" : "$4.99");
                const truncatedSessionId = t.sessionId ? `${t.sessionId.substring(0, 15)}...` : "—";

                return (
                  <tr
                    key={t._id || index}
                    className="transition hover:bg-slate-50/50 dark:hover:bg-zinc-800/20"
                  >
                    {/* User email */}
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {t.userEmail}
                    </td>

                    {/* Transaction Type badge */}
                    <td className="px-6 py-4">
                      {isPremium ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400">
                          <Crown size={12} className="text-purple-600" />
                          <span>Premium</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/20 dark:border-orange-900/30 dark:text-orange-450">
                          <Search size={12} className="text-orange-600" />
                          <span>Recipe</span>
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-450">
                      {amount}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-450">
                        paid
                      </span>
                    </td>

                    {/* Transaction ID */}
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {truncatedSessionId}
                    </td>

                    {/* Transaction date */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {paidDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsPage;
