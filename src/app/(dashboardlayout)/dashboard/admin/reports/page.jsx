"use client";

import React, { useEffect, useState } from "react";
import { fetchAllReportsAdmin, resolveReportAdmin, deleteRecipeAdmin } from "@/lib/actions/admin";
import toast from "react-hot-toast";

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // pending, dismissed, all
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchAllReportsAdmin();
        setReports(data);
      } catch (error) {
        console.error("Failed to load reports:", error);
        toast.error("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const handleResolve = async (reportId) => {
    setActionId(reportId);
    try {
      await resolveReportAdmin(reportId, "dismissed");
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: "resolved", actionTaken: "dismissed" } : r))
      );
      toast.success("Report dismissed.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to dismiss report.");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteRecipe = async (recipeId, reportId) => {
    if (!confirm("Are you sure you want to delete this reported recipe?")) return;

    setActionId(reportId);
    try {
      await deleteRecipeAdmin(recipeId);
      await resolveReportAdmin(reportId, "recipe_deleted");
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: "resolved", actionTaken: "recipe_deleted" } : r))
      );
      toast.success("Recipe deleted and report resolved.");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to process request.");
    } finally {
      setActionId(null);
    }
  };

  // State filtering logic
  const filteredReports = reports.filter((r) => {
    if (activeTab === "pending") return r.status === "pending";
    if (activeTab === "dismissed") return r.status === "resolved" && r.actionTaken === "dismissed";
    return true; // all
  });

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  if (loading) {
    return (
      <div className="py-10 px-4 md:px-10 text-center">
        <p className="text-lg text-slate-700 dark:text-slate-300 animate-pulse">
          Loading issues reports...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-10 px-4 md:px-10 bg-slate-50/50 dark:bg-zinc-950/20 min-h-screen">
      {/* Header and Subtitle with tab selection row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Recipe Reports <span className="text-2xl">🚨</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {pendingCount} pending {pendingCount === 1 ? "report" : "reports"}
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => setActiveTab("pending")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activeTab === "pending"
                ? "bg-orange-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("dismissed")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activeTab === "dismissed"
                ? "bg-orange-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Dismissed
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activeTab === "all"
                ? "bg-orange-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            All
          </button>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {filteredReports.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-500 dark:text-slate-400">No reports in this category.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Recipe ID
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Reporter
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Reason
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Description
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Reported
                </th>
                <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredReports.map((r, index) => {
                const reportDate = r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("en-GB")
                  : "16/06/2026";
                const truncatedId = r.recipeId ? `${r.recipeId.substring(0, 8)}...` : "—";
                const isPending = r.status === "pending";

                return (
                  <tr
                    key={r._id || index}
                    className="transition hover:bg-slate-50/50 dark:hover:bg-zinc-800/20"
                  >
                    {/* Truncated Recipe ID */}
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {truncatedId}
                    </td>

                    {/* Reporter */}
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {r.reporterEmail}
                    </td>

                    {/* Reason badge */}
                    <td className="px-6 py-4">
                      {r.reason === "Offensive Content" ? (
                        <span className="inline-block rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
                          Offensive Content
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400">
                          Spam
                        </span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={r.description}>
                      {r.description || "—"}
                    </td>

                    {/* Reported Date */}
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {reportDate}
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      {isPending ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteRecipe(r.recipeId, r._id)}
                            disabled={actionId === r._id}
                            className="rounded-lg bg-rose-50 border border-rose-100 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-600 transition dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400"
                          >
                            Remove Recipe
                          </button>
                          <button
                            onClick={() => handleResolve(r._id)}
                            disabled={actionId === r._id}
                            className="rounded-lg bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-slate-200 dark:border-zinc-700"
                          >
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">
                          {r.actionTaken === "recipe_deleted" ? "Recipe Deleted" : "Dismissed"}
                        </span>
                      )}
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

export default AdminReportsPage;
