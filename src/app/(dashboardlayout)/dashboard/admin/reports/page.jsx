"use client";

import React, { useEffect, useState } from "react";
import { fetchAllReportsAdmin, resolveReportAdmin, deleteRecipeAdmin } from "@/lib/actions/admin";
import toast from "react-hot-toast";

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
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
        prev.map((r) => (r._id === reportId ? { ...r, status: "resolved" } : r))
      );
      toast.success("Report marked as resolved.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to resolve report.");
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
        prev.map((r) => (r._id === reportId ? { ...r, status: "resolved" } : r))
      );
      toast.success("Recipe deleted and report resolved.");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to process request.");
    } finally {
      setActionId(null);
    }
  };

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
    <div className="space-y-6 py-10 px-4 md:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Recipe Reports
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Moderate reported issues, review complaints, and delete violating recipes.
        </p>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {reports.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-500 dark:text-slate-400">No issues reported yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Recipe Name
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Reporter User
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Issue Description
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Report Date
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, index) => {
                const reportDate = r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("en-GB")
                  : "N/A";

                return (
                  <tr
                    key={r._id || index}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
                  >
                    {/* Recipe Title */}
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {r.recipeName}
                    </td>

                    {/* Reporter */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {r.reporterEmail}
                    </td>

                    {/* Issue Description */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-[250px] truncate" title={r.issue}>
                      {r.issue}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {reportDate}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          r.status === "resolved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                        }`}
                      >
                        {r.status || "pending"}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {r.status !== "resolved" ? (
                          <>
                            <button
                              onClick={() => handleResolve(r._id)}
                              disabled={actionId === r._id}
                              className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => handleDeleteRecipe(r.recipeId, r._id)}
                              disabled={actionId === r._id}
                              className="rounded-lg bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 transition dark:bg-rose-950/20 dark:hover:bg-rose-950/30 dark:text-rose-400"
                            >
                              Delete Recipe
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                            Resolved
                          </span>
                        )}
                      </div>
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
