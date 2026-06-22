import React from "react";
import Link from "next/link";
import { fetchAdminOverviewStats } from "@/lib/actions/admin";
import { Users, ClipboardList, Crown, AlertOctagon, CreditCard } from "lucide-react";

const AdminOverviewPage = async () => {
  const stats = await fetchAdminOverviewStats();

  return (
    <div className="space-y-8 py-10 px-4 md:px-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Admin Overview <span className="text-3xl">🛡️</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Platform statistics and management
        </p>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-blue-50 p-4 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 mb-4">
            <Users size={32} />
          </div>
          <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.usersCount}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Total Users
          </span>
        </div>

        {/* Total Recipes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-amber-50 p-4 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 mb-4">
            <ClipboardList size={32} />
          </div>
          <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.recipesCount}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Total Recipes
          </span>
        </div>

        {/* Premium Members */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-purple-50 p-4 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 mb-4">
            <Crown size={32} />
          </div>
          <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.premiumCount}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Premium Members
          </span>
        </div>

        {/* Pending Reports */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-rose-50 p-4 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 mb-4">
            <AlertOctagon size={32} />
          </div>
          <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.reportsCount}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Pending Reports
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/admin/users"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 shadow-xs transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            <Users size={18} /> Manage Users
          </Link>
          <Link
            href="/dashboard/admin/recipes"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 shadow-xs transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            <ClipboardList size={18} /> Manage Recipes
          </Link>
          <Link
            href="/dashboard/admin/reports"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 shadow-xs transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            <AlertOctagon size={18} /> View Reports
          </Link>
          <Link
            href="/dashboard/admin/transactions"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 shadow-xs transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            <CreditCard size={18} /> Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
