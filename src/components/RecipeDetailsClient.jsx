"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Star, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { likeRecipe, saveFavorite, fetchUserFavorites } from "@/lib/actions/recipe";
import { reportRecipeIssue } from "@/lib/actions/admin";
import { createRecipeCheckoutAction } from "@/lib/actions/checkout";
import toast from "react-hot-toast";
import ReportRecipeModal from "./ReportRecipeModal";

const RecipeDetailsClient = ({ fallbackId }) => {
  const params = useParams();
  const routeId = params?.id;
  const recipeId = fallbackId || routeId;

  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user || null;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const requestUrl = useMemo(() => {
    if (!recipeId) return null;
    return `/api/recipes/${recipeId}`;
  }, [recipeId]);

  useEffect(() => {
    if (!requestUrl) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(requestUrl, {
          signal: controller.signal,
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        });

        if (!response.ok) {
          const json = await response.json().catch(() => null);
          throw new Error(json?.message || "Failed to load recipe details");
        }

        const data = await response.json();
        if (!controller.signal.aborted) {
          setRecipe(data?.data || null);
          setLoading(false);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Error loading recipe details");
          setLoading(false);
        }
      }
    };

    fetchRecipe();

    return () => controller.abort();
  }, [requestUrl]);

  useEffect(() => {
    if (!user?.email || !recipeId) return;

    const checkFavoriteStatus = async () => {
      try {
        const response = await fetchUserFavorites(user.email);
        const savedList = response?.data || [];
        const found = savedList.some(
          (fav) => String(fav.recipeId) === String(recipeId)
        );
        setIsSaved(found);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };

    checkFavoriteStatus();
  }, [user, recipeId]);

  if (!recipeId) {
    return (
      <div className="py-10 px-4 md:px-10">
        <p className="text-center text-lg text-slate-700 dark:text-slate-300">
          Recipe id is missing from the route.
        </p>
        <pre className="mt-4 overflow-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-200">
          {JSON.stringify({ fallbackId, routeId }, null, 2)}
        </pre>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-10 px-4 md:px-10">
        <p className="text-center text-lg text-slate-700 dark:text-slate-300">Loading recipe details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 px-4 md:px-10">
        <p className="text-center text-lg text-rose-600 dark:text-rose-400">{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="py-10 px-4 md:px-10">
        <p className="text-center text-lg text-slate-700 dark:text-slate-300">
          Recipe not found.
        </p>
      </div>
    );
  }

  const authorName = recipe.userEmail
    ? recipe.userEmail.split("@")[0]
    : "Anonymous";

  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === "string"
      ? recipe.ingredients.split("\n").map((item) => item.trim()).filter(Boolean)
      : [];

  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : typeof recipe.instructions === "string"
      ? recipe.instructions.split("\n").map((item) => item.trim()).filter(Boolean)
      : [];

  const handleLike = async () => {
    try {
      const response = await likeRecipe(recipeId);
      setRecipe((prev) => ({
        ...prev,
        likesCount: response?.data?.likesCount ?? (prev?.likesCount ?? 0) + 1,
      }));
      toast.success("Recipe liked!");
    } catch (error) {
      toast.error(error?.message || "Failed to like recipe");
    }
  };

  const handleSaveFavorite = async () => {
    if (!user?.email) {
      toast.error("You must be signed in to save favorites.");
      return;
    }

    try {
      const response = await saveFavorite(user.email, recipeId);
      setIsSaved(true);
      toast.success(response?.message || "Saved to favorites");
    } catch (error) {
      toast.error(error?.message || "Failed to save favorite");
    }
  };



  const handlePurchase = async () => {
    if (!user) {
      toast.error("You must be signed in to purchase recipe details.");
      return;
    }

    if (recipe?.isPurchased) {
      toast.error("You have already purchased this recipe.");
      return;
    }

    setPurchaseLoading(true);
    try {
      const result = await createRecipeCheckoutAction(recipeId);
      if (result?.success && result?.url) {
        window.location.href = result.url;
        return;
      }
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      throw new Error("Could not initiate purchase checkout");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-10 px-4 md:px-10">
      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className="rounded-[32px] overflow-hidden bg-white shadow-md dark:bg-zinc-950 dark:border dark:border-zinc-800">
          <img
            src={recipe.recipeImage || "/placeholder.jpg"}
            alt={recipe.recipeName}
            className="h-[420px] w-full object-cover"
          />
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200">
                {recipe.category || recipe.cuisineType || "Fast Food"}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200">
                {recipe.cuisineType || "Mexican"}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200">
                {recipe.difficultyLevel || "Easy"}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200">
                {recipe.preparationTime ? `${recipe.preparationTime}` : "20"}
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {recipe.recipeName}
            </h1>
            <div className="mt-6 flex items-center gap-3 border-y border-slate-200 py-6 dark:border-zinc-800">
              {recipe.authorImage ? (
                <img
                  src={recipe.authorImage}
                  alt={authorName}
                  className="h-14 w-14 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shadow-sm"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-900 dark:bg-zinc-900 dark:text-white animate-pulse">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{authorName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Author</p>
              </div>
            </div>

            <div className="space-y-6">
              {recipe.isLocked ? (
                <div className="relative rounded-[32px] border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 p-10 text-center backdrop-blur-xs">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300">
                    <Lock className="h-8 w-8 animate-pulse text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recipe Details Locked</h3>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Purchase this recipe's details or upgrade to Premium to view ingredients and step-by-step instructions.
                  </p>
                  <button
                    onClick={handlePurchase}
                    disabled={purchaseLoading}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition dark:bg-white dark:text-slate-950 disabled:opacity-50"
                  >
                    {purchaseLoading ? "Redirecting..." : "Purchase Details to Unlock"}
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white">Ingredients</h2>
                    <ul className="space-y-3">
                      {ingredients.map((item, index) => (
                        <li
                          key={index}
                          className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white">Instructions</h2>
                    <div className="space-y-4">
                      {instructions.map((step, index) => (
                        <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                          <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-900 shadow-sm dark:bg-zinc-950 dark:text-white">
                              {index + 1}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Step {index + 1}</p>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Actions</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={handleLike}
                disabled={recipe.isLiked}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-100 disabled:opacity-75"
              >
                <div className="flex items-center gap-2">
                  <Heart className={`h-4 w-4 ${recipe.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  {recipe.isLiked ? "Liked" : "Like"} ({recipe.likesCount ?? 0})
                </div>
              </button>
              <button
                onClick={handleSaveFavorite}
                disabled={isSaved}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-100 disabled:opacity-75"
              >
                <div className="flex items-center gap-2">
                  <Star className={`h-4 w-4 ${isSaved ? "fill-amber-400 text-amber-400" : ""}`} />
                  {isSaved ? "Saved" : "Save to Favorites"}
                </div>
              </button>
              <button
                onClick={handlePurchase}
                disabled={purchaseLoading || recipe.isPurchased}
                className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 disabled:opacity-50"
              >
                {purchaseLoading ? "Redirecting..." : recipe.isPurchased ? "Purchased" : "Purchase Details"}
              </button>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-slate-400">
              {user?.email ? (
                recipe.isReported ? (
                  <button
                    disabled
                    className="flex items-center gap-2 text-left text-slate-400 dark:text-slate-500 font-medium bg-transparent p-0 h-auto min-w-0 shadow-none border-none cursor-not-allowed"
                  >
                    Reported
                  </button>
                ) : (
                  <ReportRecipeModal
                    recipeId={recipeId}
                    recipeName={recipe.recipeName}
                    userEmail={user.email}
                    onSuccess={() => {
                      setRecipe((prev) => ({
                        ...prev,
                        isReported: true,
                      }));
                    }}
                  />
                )
              ) : (
                <button
                  onClick={() => toast.error("You must be signed in to report an issue.")}
                  className="flex items-center gap-2 text-left text-slate-700 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 font-medium cursor-pointer"
                >
                  Report Issue
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Metadata</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
                <span>Category</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{recipe.category || "Fast Food"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
                <span>Cuisine</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{recipe.cuisineType || "Mexican"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
                <span>Prep Time</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{recipe.preparationTime ?? 20} mins</span>
              </div>
              <div className="flex justify-between pt-3 dark:border-zinc-800">
                <span>Difficulty</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{recipe.difficultyLevel || "Easy"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Recipe details are loaded from the backend and displayed with full ingredients and step-by-step instructions.
        </p>
      </div>
    </div>
  );
};

export default RecipeDetailsClient;
