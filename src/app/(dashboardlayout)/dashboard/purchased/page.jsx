import React from "react";
import { getUserSession } from "@/lib/session/session";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";

const PurchasedRecipesPage = async () => {
  const user = await getUserSession();
  
  if (!user?.email) {
    return (
      <div className="py-10 px-4 md:px-10 text-center">
        <p className="text-lg text-red-600 font-semibold">Unauthorized. Please log in.</p>
      </div>
    );
  }

  const db = await getDb();
  
  // Fetch all purchases for the logged-in user
  const purchases = await db
    .collection("purchases")
    .find({ userEmail: user.email })
    .sort({ createdAt: -1 })
    .toArray();

  let purchasedRecipesList = [];

  if (purchases.length > 0) {
    // Collect all recipeIds
    const recipeIds = purchases.map((p) => {
      try {
        return new ObjectId(p.recipeId);
      } catch (e) {
        return p.recipeId;
      }
    });

    // Query recipes details from database
    const recipes = await db
      .collection("recipes")
      .find({
        $or: [
          { _id: { $in: recipeIds.filter((id) => id instanceof ObjectId) } },
          { id: { $in: purchases.map((p) => p.recipeId) } },
        ],
      })
      .toArray();

    // Map purchases to include recipe details
    purchasedRecipesList = purchases.map((purchase) => {
      const recipe = recipes.find(
        (r) =>
          String(r._id) === String(purchase.recipeId) ||
          String(r.id) === String(purchase.recipeId)
      );

      // Extract author's name from email (split before @) or display creator's actual name if available
      const authorEmail = recipe?.userEmail || "Anonymous";
      const authorName = recipe?.authorName || authorEmail.split("@")[0];

      // Format date as DD/MM/YYYY
      const formattedDate = purchase.createdAt
        ? new Date(purchase.createdAt).toLocaleDateString("en-GB")
        : "N/A";

      return {
        id: purchase.recipeId,
        recipeName: recipe?.recipeName || "Unknown Recipe",
        recipeImage: recipe?.recipeImage || "/placeholder.jpg",
        author: authorName,
        amountPaid: "$4.99",
        date: formattedDate,
      };
    });
  }

  return (
    <div className="space-y-6 py-10 px-4 md:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Purchased Recipes
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Recipes you've unlocked
        </p>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {purchasedRecipesList.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-500 dark:text-slate-400">
            You have not unlocked any recipes yet. Browse recipes to unlock them.
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
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Recipe
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Author
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Amount Paid
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Date
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {purchasedRecipesList.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
                >
                  {/* Recipe Image + Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.recipeImage}
                        alt={item.recipeName}
                        className="h-12 w-12 rounded-lg object-cover border border-slate-100 dark:border-zinc-800"
                      />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {item.recipeName}
                      </span>
                    </div>
                  </td>

                  {/* Author Name */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.author}
                  </td>

                  {/* Amount Paid */}
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {item.amountPaid}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {item.date}
                  </td>

                  {/* Action Button */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/browse-recipes/${item.id}`}
                      className="inline-block rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700 shadow-xs"
                    >
                      View Recipe
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchasedRecipesPage;
