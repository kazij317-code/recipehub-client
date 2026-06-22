"use client";

import React, { useEffect, useState } from "react";
import { fetchAllRecipesAdmin, toggleRecipeFeaturedAdmin, deleteRecipeAdmin } from "@/lib/actions/admin";
import { Star, Trash2 } from "lucide-react";
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

  const handleToggleFeatured = async (recipeId) => {
    setActionRecipeId(recipeId);
    try {
      const response = await toggleRecipeFeaturedAdmin(recipeId);
      setRecipes((prev) =>
        prev.map((r) => (r._id === recipeId ? { ...r, isFeatured: response.isFeatured } : r))
      );
      toast.success(response.isFeatured ? "Recipe featured" : "Recipe unfeatured");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to toggle featured status");
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
    <div className="space-y-6 py-10 px-4 md:px-10 bg-slate-50/50 dark:bg-zinc-950/20 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          Manage Recipes 📋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Delete recipes or toggle featured status
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/50 shadow-xs">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/10">
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Recipe
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Likes
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {recipes.map((r, index) => {
              const recipeImage = r.recipeImage || "/placeholder.jpg";
              const authorName = r.authorName || r.userEmail?.split("@")[0] || "Anonymous";
              const isFeatured = r.isFeatured;

              return (
                <tr
                  key={r._id || index}
                  className="transition hover:bg-slate-50/50 dark:hover:bg-zinc-800/20"
                >
                  {/* Recipe Image + Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={recipeImage}
                        alt={r.recipeName}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-100 dark:border-zinc-800 shadow-2xs"
                      />
                      <span className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                        {r.recipeName}
                      </span>
                    </div>
                  </td>

                  {/* Author Name */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    {authorName}
                  </td>

                  {/* Category Badge */}
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300">
                      {r.category || r.cuisineType || "Recipe"}
                    </span>
                  </td>

                  {/* Likes with red heart icon */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                      <span className="text-red-500 text-xs">❤️</span>
                      <span>{r.likesCount ?? 0}</span>
                    </div>
                  </td>

                  {/* Featured Status Badge */}
                  <td className="px-6 py-4">
                    {isFeatured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400">
                        <Star size={10} className="fill-purple-600 text-purple-600" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-400">
                        Regular
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleFeatured(r._id)}
                        disabled={actionRecipeId === r._id}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                          isFeatured
                            ? "bg-purple-50 border-purple-100 hover:bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400"
                            : "bg-amber-50 border-amber-100 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {isFeatured ? "Unfeature" : (
                          <>
                            <Star size={12} className="text-amber-600" />
                            <span>Feature</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(r._id)}
                        disabled={actionRecipeId === r._id}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-100 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-600 transition dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRecipesPage;
