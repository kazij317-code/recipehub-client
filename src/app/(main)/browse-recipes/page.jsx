import React from "react";
import { fetchAllRecipes } from "@/lib/actions/recipe";
import RecipeCard from "@/components/RecipeCard";

const BrowseAllRecipePage = async () => {
  const recipesResponse = await fetchAllRecipes();
  const recipes = recipesResponse?.data || [];

  return (
    <div className="space-y-6 py-10 px-4 md:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Browse Recipes
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Discover delicious recipes from our community.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-700 dark:text-slate-300">
            No recipes available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id?.toString?.() || recipe.id || recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseAllRecipePage;
