"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Eye, Pencil, Trash2, AlertCircle, X } from "lucide-react";
import { deleteRecipe } from "@/lib/actions/recipe";
import toast from "react-hot-toast";

const RecipesTable = ({ recipes }) => {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getRecipeId = (recipe) => {
    return (
      recipe._id?.toString?.() ||
      recipe._id?.$oid ||
      recipe.id?.toString?.() ||
      recipe.id
    );
  };

  const handleDeleteClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteRecipe(selectedRecipe._id || selectedRecipe.id);
      toast.success("Recipe deleted.");
      setShowDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Could not delete recipe.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
    setSelectedRecipe(null);
  };

  const handleEdit = (recipeId) => {
    window.location.href = `/dashboard/user/add-recipe?edit=${recipeId}`;
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800">
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">
                Recipe
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">
                Category
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">
                Difficulty
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">
                Likes
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">
                Status
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe, index) => {
              const recipeId = getRecipeId(recipe);
              const difficulty = recipe.difficultyLevel || "Easy";
              const status = recipe.status || "Regular";

              return (
                <tr
                  key={recipeId || index}
                  className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                >
                  {/* Recipe Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={recipe.recipeImage || "/placeholder.jpg"}
                        alt={recipe.recipeName}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {recipe.recipeName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(recipe.createdAt || recipe.dateAdded)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category Column */}
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">
                      {recipe.cuisineType || recipe.category || "Recipe"}
                    </span>
                  </td>

                  {/* Difficulty Column */}
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        difficulty === "Hard"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                          : difficulty === "Medium"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-200"
                      }`}
                    >
                      {difficulty}
                    </span>
                  </td>

                  {/* Likes Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>{recipe.likesCount ?? 0}</span>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-zinc-700 dark:text-slate-200">
                      {status}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/browse-recipes/${recipeId}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700"
                      >
                        <Eye className="mr-1 inline h-4 w-4" />
                        View
                      </Link>
                      <button
                        onClick={() => handleEdit(recipeId)}
                        className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200 dark:hover:bg-orange-500/20"
                      >
                        <Pencil className="mr-1 inline h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(recipe)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
                      >
                        <Trash2 className="mr-1 inline h-4 w-4" />
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

      {/* Delete Modal */}
      {showDeleteModal && selectedRecipe && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative w-96 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
            <button
              onClick={handleCancel}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-rose-100 p-4 dark:bg-rose-500/20">
                <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              </div>
            </div>

            <h3 className="mb-4 text-center text-xl font-bold text-slate-900 dark:text-white">
              Delete recipe permanently?
            </h3>

            <p className="mb-8 text-center text-slate-600 dark:text-slate-300">
              This will permanently delete <span className="font-semibold">{selectedRecipe.recipeName}</span>. 
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={deleting}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-slate-200 dark:hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 rounded-full bg-rose-600 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50 dark:bg-rose-600 dark:hover:bg-rose-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipesTable;
