"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, AlertCircle, X } from "lucide-react";
import { deleteRecipe } from "@/lib/actions/recipe";
import toast from "react-hot-toast";

const RecipeCardActions = ({ recipeId, recipeName, onDeleted }) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/user/add-recipe?edit=${recipeId}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteRecipe(recipeId);
      toast.success("Recipe deleted.");
      setShowDeleteModal(false);
      onDeleted?.();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Could not delete recipe.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleEdit}
          className="rounded-3xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200"
        >
          <Pencil className="mr-1 inline h-4 w-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={deleting}
          className="rounded-3xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="mr-1 inline h-4 w-4" />
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative w-96 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
            {/* Close Button */}
            <button
              onClick={handleCancel}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Alert Icon */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-rose-100 p-4 dark:bg-rose-500/20">
                <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              </div>
            </div>

            {/* Heading */}
            <h3 className="mb-4 text-center text-xl font-bold text-slate-900 dark:text-white">
              Delete recipe permanently?
            </h3>

            {/* Description */}
            <p className="mb-8 text-center text-slate-600 dark:text-slate-300">
              This will permanently delete <span className="font-semibold">{recipeName}</span>. 
              This action cannot be undone.
            </p>

            {/* Buttons */}
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

export default RecipeCardActions;
