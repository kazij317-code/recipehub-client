import React from "react";
import HeroSection from "@/components/Hero";
import RecipeCard from "@/components/RecipeCard";
import ExtraHomeSections from "@/components/ExtraHomeSections";
import { fetchAllRecipes } from "@/lib/actions/recipe";
import Link from "next/link";
import { Heart } from "lucide-react";

export default async function Home() {
  const recipesResponse = await fetchAllRecipes({ limit: 100 });
  const recipes = recipesResponse?.data || [];

  // 1. Featured Editorials (isFeatured === true)
  const featuredRecipes = recipes.filter((r) => r.isFeatured);

  // 2. Popular Recipes (Sorted by likesCount descending, limit to 8)
  const popularRecipes = [...recipes]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 8);

  return (
    <>
      <HeroSection />

      {/* Featured Editorials Section */}
      <section className="py-16 px-4 md:px-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-6 dark:border-zinc-800">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Featured Editorials
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Curated selections from our expert culinary community.
          </p>
        </div>

        {featuredRecipes.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No featured recipes available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe._id?.toString?.() || recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Recipes Section */}
      <section className="py-16 px-4 md:px-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-6 dark:border-zinc-800">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Popular Recipes
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            The highest liked recipes across our platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularRecipes.map((recipe, index) => {
            const recipeId = recipe._id?.toString?.() || recipe.id;
            const rank = index + 1;
            const authorName = recipe.userEmail ? recipe.userEmail.split("@")[0] : "Anonymous";
            const category = recipe.category || recipe.cuisineType || "Recipe";

            return (
              <Link
                key={recipeId}
                href={`/browse-recipes/${recipeId}`}
                className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:shadow-md transition duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank number */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      rank <= 3
                        ? "bg-slate-950 text-white dark:bg-zinc-800"
                        : "bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-slate-400"
                    }`}
                  >
                    {rank}
                  </div>

                  {/* Thumbnail Image */}
                  <img
                    src={recipe.recipeImage || "/placeholder.jpg"}
                    alt={recipe.recipeName}
                    className="h-12 w-12 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-zinc-800"
                  />

                  {/* Details */}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {recipe.recipeName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {authorName} · {category}
                    </p>
                  </div>
                </div>

                {/* Likes */}
                <div className="flex items-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400 text-sm font-medium pr-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span>{recipe.likesCount ?? 0}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Extra Home Sections */}
      <ExtraHomeSections />
    </>
  );
}
