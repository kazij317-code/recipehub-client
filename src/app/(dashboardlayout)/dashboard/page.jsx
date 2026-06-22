import React from "react";
import Link from "next/link";
import { getUserSession } from "@/lib/session/session";
import {
  fetchUserRecipes,
  fetchUserFavorites,
  fetchTotalEngagement,
} from "@/lib/actions/recipe";
import { FileText, Bookmark, Heart, ArrowRight } from "lucide-react";

const DashboardPage = async () => {
  const user = await getUserSession();
  const recipesResponse = await fetchUserRecipes(user?.email);
  const recipes = recipesResponse?.data || [];
  const favoritesResponse = await fetchUserFavorites(user?.email);
  const engagementResponse = await fetchTotalEngagement();

  const publishedRecipes = recipes.length;
  const savedFavorites = favoritesResponse?.count ?? 0;
  const totalEngagement = engagementResponse?.count ?? 0;

  const userName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="space-y-8 py-10 px-4 md:px-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back, {userName}. Here is your command center.
          </p>
        </div>
        <Link
          href="#"
          className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-900 transition hover:text-slate-700 dark:text-white dark:hover:text-slate-200"
        >
          Upgrade to Pro <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Published Recipes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Published Recipes
            </h3>
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-zinc-800">
              <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <p className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            {publishedRecipes}
          </p>
          <Link
            href="/dashboard/my-recipes"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            View details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Saved Favorites */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Saved Favorites
            </h3>
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-zinc-800">
              <Bookmark className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <p className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            {savedFavorites}
          </p>
          <Link
            href="/dashboard/favorites"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            View details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Total Engagement */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Total Engagement
            </h3>
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-zinc-800">
              <Heart className="h-5 w-5 text-rose-500" />
            </div>
          </div>
          <p className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            {totalEngagement}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Across all recipes
          </p>
        </div>
      </div>

      {/* Storage Limit */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
              {user?.plan === "premium"
                ? `• Premium Plan: ${publishedRecipes} Recipes (Unlimited)`
                : `• Storage Limit: ${publishedRecipes}/2 Recipes`}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {user?.plan === "premium"
                ? "You have unlocked unlimited recipe storage with your premium plan!"
                : "Basic accounts are limited to 2 recipes. Upgrade to unlock unlimited storage."}
            </p>
          </div>
          {user?.plan !== "premium" && (
            <Link
              href="/dashboard/upgrade"
              className="whitespace-nowrap rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Upgrade Account
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
          Quick Actions
        </h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Link
            href="/dashboard/user/add-recipe"
            className="rounded-full border-2 border-slate-900 bg-slate-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-slate-800 dark:border-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Create new recipe
          </Link>
          <Link
            href="/browse-recipes"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            Browse gallery
          </Link>
          <Link
            href="/dashboard/favorites"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            View saved items
          </Link>
          <Link
            href="/dashboard/profile"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            Account settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
