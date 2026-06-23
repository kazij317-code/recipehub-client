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

            // Define rank styling
            let rankBadgeClass = "";
            if (rank === 1) {
              rankBadgeClass = "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm shadow-amber-500/20";
            } else if (rank === 2) {
              rankBadgeClass = "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-sm shadow-slate-400/20";
            } else if (rank === 3) {
              rankBadgeClass = "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-sm shadow-orange-500/20";
            } else {
              rankBadgeClass = "bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-slate-400 border border-slate-200/50 dark:border-zinc-800";
            }

            return (
              <Link
                key={recipeId}
                href={`/browse-recipes/${recipeId}`}
                className="group flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-slate-100 bg-white hover:border-transparent hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-0.5 transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-950 dark:hover:bg-zinc-900/60"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rank number */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition-all duration-300 ${rankBadgeClass}`}
                  >
                    {rank}
                  </div>

                  {/* Thumbnail Image */}
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-zinc-800">
                    <img
                      src={recipe.recipeImage || "/placeholder.jpg"}
                      alt={recipe.recipeName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                      {recipe.recipeName}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      by <span className="text-slate-700 dark:text-slate-300 font-semibold">{authorName}</span> · {category}
                    </p>
                  </div>
                </div>

                {/* Likes */}
                <div className="flex items-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400 text-sm font-semibold pr-2">
                  <Heart className="h-4 w-4 text-rose-500 fill-transparent transition-all duration-300 group-hover:scale-110 group-hover:fill-rose-500" />
                  <span className="group-hover:text-rose-500 transition-colors duration-300">{recipe.likesCount ?? 0}</span>
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
