"use client";

import React, { useEffect, useState } from "react";
import { fetchAllTransactionsAdmin } from "@/lib/actions/admin";
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
    <div className="space-y-6 py-10 px-4 md:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Payment Transactions
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor subscription upgrades and recipe details purchase history.
        </p>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {transactions.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-500 dark:text-slate-400">No payment transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  User Email
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Transaction/Purchase ID
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Amount
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Paid Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => {
                const paidDate = t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("en-GB")
                  : "N/A";
                const amount = t.amount || "$4.99"; // Fallback default recipe amount or subscription amount

                return (
                  <tr
                    key={t._id || index}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
                  >
                    {/* User email */}
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {t.userEmail}
                    </td>

                    {/* ID */}
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {t._id}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {amount}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
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
