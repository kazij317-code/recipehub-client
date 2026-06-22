"use server";

import { serverMution } from "../core/server";
import { headers } from "next/headers";
import { getDb } from "../db";
import { ObjectId } from "mongodb";
import { getUserSession } from "../session/session";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";

const appBaseUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export const addRecipe = async (data) => {
  return await serverMution("/api/recipes", data, "POST");
};

export const updateRecipe = async (id, data) => {
  return await serverMution(`/api/recipes/${id}`, data, "PUT");
};

export const deleteRecipe = async (id) => {
  return await serverMution(`/api/recipes/${id}`, null, "DELETE");
};

export const updateuserAddrecipeLimit = async (id) => {
  return await serverMution(`/api/user/${id}`, null, "PATCH");
};

export const fetchAllRecipes = async () => {
  const response = await fetch(new URL("/api/allrecipes", apiBaseUrl).toString(), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }
  return response.json();
};

export const fetchRecipeById = async (id) => {
  if (!id) {
    throw new Error("Recipe id is required");
  }

  // Try direct API route first
  try {
    const url = new URL(`/api/recipes/${id}`, apiBaseUrl);
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (response.ok) {
      return response.json();
    }
  } catch (err) {
    // fallthrough to fallback below
  }

  // Fallback: fetch all and find by id
  const all = await fetchAllRecipes();
  const recipe = (all?.data || []).find(
    (r) => String(r._id) === String(id) || String(r.id) === String(id),
  );
  return { data: recipe };
};

export const fetchUserRecipes = async (email) => {
  if (!email) {
    return { data: [] };
  }

  const url = new URL("/api/user-recipes", apiBaseUrl);
  url.searchParams.set("email", email);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (response.ok) {
    return response.json();
  }

  if (response.status === 404) {
    const allRecipes = await fetchAllRecipes();
    const filtered = (allRecipes?.data || []).filter(
      (recipe) => recipe.userEmail === email,
    );
    return { data: filtered };
  }

  throw new Error("Failed to fetch user recipes");
};

export const likeRecipe = async (id) => {
  const url = new URL(`/api/recipes/${id}/like`, appBaseUrl);
  const clientHeaders = await headers();
  const reqHeaders = { "Content-Type": "application/json" };
  const cookie = clientHeaders.get("cookie");
  if (cookie) {
    reqHeaders["cookie"] = cookie;
  }
  const authHeader = clientHeaders.get("authorization");
  if (authHeader) {
    reqHeaders["authorization"] = authHeader;
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: reqHeaders,
  });

  if (!response.ok) {
    throw new Error("Failed to like recipe");
  }

  return response.json();
};


export const saveFavorite = async (email, recipeId) => {
  const user = await getUserSession();
  const userEmail = user?.email;

  if (!userEmail) {
    throw new Error("Unauthorized");
  }

  if (!recipeId) {
    throw new Error("recipeId is required.");
  }

  const db = await getDb();
  const favoritesCollection = db.collection("recipeFavorites");
  const existing = await favoritesCollection.findOne({ recipeId, userEmail });

  if (existing) {
    return { status: true, message: "Already in favorites", data: { ...existing, _id: existing._id.toString() } };
  }

  const inserted = await favoritesCollection.insertOne({ recipeId, userEmail, createdAt: new Date() });
  return { status: true, message: "Saved to favorites", data: { id: inserted.insertedId.toString(), recipeId } };
};

export const removeFavorite = async (email, recipeId) => {
  const user = await getUserSession();
  const userEmail = user?.email;

  if (!userEmail) {
    throw new Error("Unauthorized");
  }

  if (!recipeId) {
    throw new Error("recipeId is required.");
  }

  const db = await getDb();
  const favoritesCollection = db.collection("recipeFavorites");
  const result = await favoritesCollection.deleteOne({ recipeId, userEmail });

  if (result.deletedCount === 0) {
    throw new Error("Favorite not found");
  }

  return { status: true, message: "Removed from favorites" };
};

export const fetchUserFavorites = async (email) => {
  if (!email) {
    return { count: 0, data: [] };
  }

  const db = await getDb();
  const favoritesCollection = db.collection("recipeFavorites");
  const favorites = await favoritesCollection.find({ userEmail: email }).toArray();

  if (favorites.length === 0) {
    return { count: 0, data: [] };
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
    
    const serializedRecipe = recipe ? {
      ...recipe,
      _id: recipe._id ? recipe._id.toString() : null,
    } : null;

    return {
      ...fav,
      _id: fav._id ? fav._id.toString() : null,
      recipe: serializedRecipe,
    };
  }).filter(fav => fav.recipe !== null);

  return { count: populatedFavorites.length, data: populatedFavorites };
};

export const fetchTotalEngagement = async () => {
  const url = new URL("/api/engagement", appBaseUrl);
  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch engagement");
  }

  return response.json();
};
