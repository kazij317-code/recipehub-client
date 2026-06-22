import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  if (!email) {
    return NextResponse.json({ count: 0, data: [] });
  }

  const db = await getDb();
  const favoritesCollection = db.collection("recipeFavorites");
  const favorites = await favoritesCollection.find({ userEmail: email }).toArray();

  if (favorites.length === 0) {
    return NextResponse.json({ count: 0, data: [] });
  }

  const recipeIds = favorites.map((f) => {
    try {
      return new ObjectId(f.recipeId);
    } catch (e) {
      return f.recipeId;
    }
  });

  const recipes = await db
    .collection("recipes")
    .find({
      $or: [
        { _id: { $in: recipeIds.filter((id) => id instanceof ObjectId) } },
        { id: { $in: favorites.map((f) => f.recipeId) } },
      ],
    })
    .toArray();

  const populatedFavorites = favorites.map((fav) => {
    const recipe = recipes.find(
      (r) =>
        String(r._id) === String(fav.recipeId) ||
        String(r.id) === String(fav.recipeId)
    );
    return {
      ...fav,
      recipe: recipe || null,
    };
  }).filter(fav => fav.recipe !== null);

  return NextResponse.json({ count: populatedFavorites.length, data: populatedFavorites });
}

