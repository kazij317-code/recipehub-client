"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import RecipeCardActions from "@/components/RecipeCardActions";
import { useSession } from "@/lib/auth-client";

const RecipeCard = ({ recipe, isOwner = false }) => {
  const { data } = useSession();
  const isLoggedIn = !!data?.user;

  const authorName = recipe.userEmail
    ? recipe.userEmail.split("@")[0]
    : "Anonymous";

  const categoryLabel = recipe.category || recipe.cuisineType || "Recipe";
  const prepTimeLabel = recipe.preparationTime
    ? `${recipe.preparationTime} mins`
    : "N/A";
  const recipeId =
    recipe._id?.toString?.() ||
    recipe._id?.$oid ||
    recipe.id?.toString?.() ||
    recipe.id;

  if (!recipeId) {
    return null;
  }

  const detailUrl = isLoggedIn
    ? `/browse-recipes/${recipeId}`
    : `/login?redirectTo=/browse-recipes/${recipeId}`;

  return (
    <div className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
      <Link href={detailUrl} className="relative block overflow-hidden">
        <img
          src={recipe.recipeImage || "/placeholder.jpg"}
          alt={recipe.recipeName}
          className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-md dark:bg-zinc-900/95 dark:text-slate-200">
          {categoryLabel}
        </span>
      </Link>

      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {recipe.recipeName}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{recipe.cuisineType || recipe.category || "Cuisine"}</span>
            <span>·</span>
            <span>{prepTimeLabel}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
            {recipe.difficultyLevel || "Easy"}
          </span>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Heart className="h-4 w-4 text-rose-500" />
            <span>{recipe.likesCount ?? 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-slate-400">
          <span>{authorName}</span>
          <div className="flex items-center gap-2">
            <Link
              href={detailUrl}
              className="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-300"
            >
              View
            </Link>
            {isOwner && (
              <RecipeCardActions
                recipeId={recipeId}
                recipeName={recipe.recipeName}
                onDeleted={() => window.location.reload()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
