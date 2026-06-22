import React from "react";
import { getUserSession } from "@/lib/session/session";
import { fetchUserRecipes } from "@/lib/actions/recipe";
import RecipesTable from "@/components/RecipesTable";
import Link from "next/link";

const MyRecipesPage = async () => {
  const user = await getUserSession();
  const recipesResponse = await fetchUserRecipes(user?.email);
  const recipes = recipesResponse?.data || [];

  return (
    <div className="space-y-6 py-10 px-4 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Recipes
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {recipes.length} recipe {recipes.length !== 1 ? "published" : "published"}
          </p>
        </div>
        <Link
          href="/dashboard/user/add-recipe"
          className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          + Add Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-700 dark:text-slate-300">
            You have not added any recipes yet. Add one to see it here.
          </p>
        </div>
      ) : (
        <RecipesTable recipes={recipes} />
      )}
    </div>
  );
};

export default MyRecipesPage;
