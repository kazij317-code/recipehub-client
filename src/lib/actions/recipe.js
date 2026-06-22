"use server";

import { serverMution } from "../core/server";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
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
  const url = new URL(`/api/recipes/${id}/like`, apiBaseUrl);
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to like recipe");
  }

  return response.json();
};


export const saveFavorite = async (email, recipeId) => {
  const url = new URL(`/api/user/favorites`, apiBaseUrl);
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, recipeId }),
  });

  if (!response.ok) {
    throw new Error("Failed to save favorite");
  }

  return response.json();
};

export const fetchUserFavorites = async (email) => {
  if (!email) {
    return { count: 0, data: [] };
  }

  const url = new URL("/api/user-favorites", apiBaseUrl);
  url.searchParams.set("email", email);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error("Failed to fetch user favorites");
};

export const fetchTotalEngagement = async () => {
  const url = new URL("/api/engagement", apiBaseUrl);
  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch engagement");
  }

  return response.json();
};
