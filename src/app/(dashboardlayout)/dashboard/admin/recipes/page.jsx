"use client";

import React, { useEffect, useState } from "react";
import { fetchAllRecipesAdmin, toggleRecipeLockAdmin, deleteRecipeAdmin } from "@/lib/actions/admin";
import toast from "react-hot-toast";

const ManageRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionRecipeId, setActionRecipeId] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchAllRecipesAdmin();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to load recipes:", error);
        toast.error("Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  const handleToggleLock = async (recipeId) => {
    setActionRecipeId(recipeId);
    try {
      const response = await toggleRecipeLockAdmin(recipeId);
      setRecipes((prev) =>
        prev.map((r) => (r._id === recipeId ? { ...r, isLocked: response.isLocked } : r))
      );
      toast.success(response.isLocked ? "Recipe locked" : "Recipe unlocked");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to update recipe lock status");
    } finally {
      setActionRecipeId(null);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Are you sure you want to permanently delete this recipe?")) return;

    setActionRecipeId(recipeId);
    try {
      await deleteRecipeAdmin(recipeId);
      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      toast.success("Recipe deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to delete recipe");
    } finally {
      setActionRecipeId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 px-4 md:px-10 text-center">
        <p className="text-lg text-slate-700 dark:text-slate-300 animate-pulse">
          Loading recipes database...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-10 px-4 md:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Manage Recipes
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor recipes, toggle locks, and moderate submissions.
        </p>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {recipes.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-500 dark:text-slate-400">No recipes found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Recipe
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Category
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Author
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Lock Status
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r, index) => {
                const recipeImage = r.recipeImage || "/placeholder.jpg";
                const authorEmail = r.userEmail || "Anonymous";

                return (
                  <tr
                    key={r._id || index}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
                  >
                    {/* Recipe Image + Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={recipeImage}
                          alt={r.recipeName}
                          className="h-12 w-12 rounded-lg object-cover border border-slate-100 dark:border-zinc-800"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                          {r.recipeName}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {r.category || r.cuisineType || "Recipe"}
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {authorEmail}
                    </td>

                    {/* Lock Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          r.isLocked
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                        }`}
                      >
                        {r.isLocked ? "Locked" : "Unlocked"}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleLock(r._id)}
                          disabled={actionRecipeId === r._id}
                          className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700"
                        >
                          {r.isLocked ? "Unlock Recipe" : "Lock Recipe"}
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(r._id)}
                          disabled={actionRecipeId === r._id}
                          className="rounded-lg bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 transition dark:bg-rose-950/20 dark:hover:bg-rose-950/30 dark:text-rose-400"
                        >
                          Delete
                        </button>
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

export default ManageRecipesPage;
