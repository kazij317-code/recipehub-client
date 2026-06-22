"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { fetchUserFavorites, removeFavorite } from "@/lib/actions/recipe";
import Link from "next/link";
import toast from "react-hot-toast";

const FavoritesPage = () => {
  const { data: sessionData, isPending } = authClient.useSession();
  const user = sessionData?.user || null;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (isPending) return;

    if (!user?.email) {
      setLoading(false);
      return;
    }

    const loadFavorites = async () => {
      try {
        const response = await fetchUserFavorites(user.email);
        setFavorites(response?.data || []);
      } catch (error) {
        console.error("Failed to load favorites:", error);
        toast.error("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, isPending]);

  const handleRemove = async (recipeId) => {
    if (!user?.email) return;

    setRemovingId(recipeId);
    try {
      await removeFavorite(user.email, recipeId);
      setFavorites((prev) => prev.filter((fav) => fav.recipeId !== recipeId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error(error.message || "Failed to remove favorite");
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="py-10 px-4 md:px-10 text-center">
        <p className="text-lg text-slate-700 dark:text-slate-300 animate-pulse">
          Loading your favorites...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-10 px-4 md:px-10 text-center">
        <p className="text-lg text-rose-600 font-semibold">
          Unauthorized. Please log in to view favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-10 px-4 md:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Favorites
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Recipes you have saved to favorites
        </p>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-500 dark:text-slate-400">
            You have not saved any recipes yet. Browse recipes to save them.
          </p>
          <div className="mt-6">
            <Link
              href="/browse-recipes"
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => {
            const recipe = fav.recipe;
            if (!recipe) return null;
            const recipeId = recipe._id || recipe.id;

            return (
              <div
                key={fav._id || recipeId}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <img
                  src={recipe.recipeImage || "/placeholder.jpg"}
                  alt={recipe.recipeName}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5 space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                    {recipe.recipeName}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300">
                      {recipe.category || recipe.cuisineType || "Recipe"}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                      <span className="text-red-500">❤️</span>
                      <span>{recipe.likesCount ?? 0}</span>
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/browse-recipes/${recipeId}`}
                      className="flex-1 rounded-xl bg-slate-950 hover:bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white transition dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemove(recipeId)}
                      disabled={removingId === recipeId}
                      className="rounded-xl bg-rose-50 hover:bg-rose-100 py-2 px-4 text-sm font-semibold text-rose-600 transition dark:bg-rose-950/20 dark:hover:bg-rose-950/30 dark:text-rose-400 disabled:opacity-50"
                    >
                      {removingId === recipeId ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
