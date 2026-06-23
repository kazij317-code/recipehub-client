import React from "react";
import { fetchAllRecipes } from "@/lib/actions/recipe";
import RecipeCard from "@/components/RecipeCard";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";

const AVAILABLE_CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Salad",
  "Fast Food",
  "Noodles",
  "Seafood",
  "Pizza",
  "Pasta",
  "Dessert"
];

const BrowseAllRecipePage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page) || 1;
  const categories = resolvedSearchParams?.categories || "";

  const recipesResponse = await fetchAllRecipes({
    page,
    limit: 9,
    categories,
  });

  const recipes = recipesResponse?.data || [];
  const pagination = recipesResponse?.pagination || {
    page: 1,
    limit: 9,
    totalCount: recipes.length,
    totalPages: 1,
  };

  return (
    <div className="space-y-8 py-10 px-4 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            Browse Recipes
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Discover delicious recipes from our community.
        </p>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Filter by Category
        </h3>
        <CategoryFilter availableCategories={AVAILABLE_CATEGORIES} />
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
            No recipes available matching the selected criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id?.toString?.() || recipe.id || recipe._id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.page}
          />
        </div>
      )}
    </div>
  );
};

export default BrowseAllRecipePage;
