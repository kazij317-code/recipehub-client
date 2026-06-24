"use client";

import React, { useState, useEffect } from "react";
import { Crown, Upload, Trash2, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { addRecipe, updateuserAddrecipeLimit, fetchRecipeById, updateRecipe } from "@/lib/actions/recipe";

export default function AddRecipeForm({ user }) {
  // 2. Loading states
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // 3. Form input states
  const [recipeName, setRecipeName] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [prepTime, setPrepTime] = useState("");
  const [recipeImage, setRecipeImage] = useState("");

  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const cuisineOptions = [
    "Bangladeshi",
    "Italian",
    "Indian",
    "Chinese",
    "Thai",
    "Mexican",
    "American",
    "Mediterranean",
    "French",
    "Japanese",
    "Other",
  ];

  // 4. Free limit logic (only apply to new creations, not edits)
  const hasReachedLimit = !editId && !user.isPremium && user.totalRecipesCreated >= 2;

  useEffect(() => {
    if (!editId) return;

    const loadRecipe = async () => {
      setLoading(true);
      try {
        const res = await fetchRecipeById(editId);
        if (res?.data) {
          const r = res.data;
          setRecipeToEdit(r);
          setRecipeName(r.recipeName || "");
          setCuisineType(r.cuisineType || "");
          setCategory(r.category || "");
          setDifficulty(r.difficultyLevel || "Easy");
          setPrepTime(r.preparationTime || "");
          setRecipeImage(r.recipeImage || "");
          setIngredients(Array.isArray(r.ingredients) ? r.ingredients.join("\n") : "");
          setInstructions(Array.isArray(r.instructions) ? r.instructions.join("\n") : "");
        }
      } catch (err) {
        console.error("Failed to load recipe for editing:", err);
        toast.error("Failed to load recipe details.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [editId]);

  // --- ImgBB Image Upload Handler ---
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API; // Replace with your actual ImgBB API Key
      if (!IMGBB_API_KEY) {
        throw new Error("ImgBB API key is not configured.");
      }
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        const errorMessage = data?.error?.message || "Image upload failed!";
        console.error("ImgBB upload failed", data);
        toast.error(errorMessage);
        return;
      }

      setRecipeImage(data.data.display_url || data.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`${error.message}` || "Error uploading image:");
    } finally {
      setImageUploading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // --- Form Submit Function ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalRecipeData = {
      userId: user?.id,
      userEmail: user?.email,
      recipeName,
      recipeImage,
      category,
      cuisineType,
      difficultyLevel: difficulty,
      preparationTime: Number(prepTime),
      ingredients: ingredients
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      instructions: instructions
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      let res;
      if (editId) {
        finalRecipeData.likesCount = recipeToEdit?.likesCount ?? 0;
        finalRecipeData.isFeatured = recipeToEdit?.isFeatured ?? false;
        finalRecipeData.status = recipeToEdit?.status ?? "published";
        res = await updateRecipe(editId, finalRecipeData);
      } else {
        finalRecipeData.likesCount = 0;
        finalRecipeData.isFeatured = false;
        finalRecipeData.status = "published";
        res = await addRecipe(finalRecipeData);
      }

      if (res?.status === true) {
        toast.success(res.message || (editId ? "Recipe updated!" : "Recipe added!"));

        if (!editId && user?.limit < 2) {
          try {
            await updateuserAddrecipeLimit(user?.id);
          } catch (limitErr) {
            console.error("Limit update error:", limitErr);
          }
        }

        window.location.href = "/dashboard/my-recipes";
      } else {
        toast.error(res?.message || "Failed to save recipe.");
      }
    } catch (error) {
      console.error("Add recipe error:", error);
      toast.error(error?.message || "Failed to save recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 py-10 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto ">
        {hasReachedLimit ? (
          /* Premium Subscription Card (Shown when free limit is exceeded) */
          <div className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-900 dark:border-amber-500/20 p-8 rounded-2xl text-center max-w-xl mx-auto mt-12 shadow-xl">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 mt-10">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Recipe Limit Reached!
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 mb-6">
              You have added the maximum of 2 free recipes. Please purchase a
              premium membership to unlock unlimited recipe additions.
            </p>
            <button
              type="button"
              onClick={() => router.push('/dashboard/upgrade')}
              className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition shadow-md"
            >
              Become a Premium Member
            </button>
          </div>
        ) : (
          /* ✅ Recipe Form */
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 md:p-10 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editId ? "Edit " : "Add "}
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    {editId ? "Recipe" : "New Recipe"}
                  </span>{" "}
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  {editId ? "Update your recipe details below" : "Share your culinary creation with the world"}
                </p>
              </div>
              {!editId && (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  Slots Remaining: {2 - user.totalRecipesCreated}
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recipe Name
                  </label>
                  <input
                    type="text"
                    required
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-transparent outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                    placeholder="e.g., Kacchi Biryani"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cuisine Type
                  </label>
                  <select
                    required
                    value={cuisineType}
                    onChange={(e) => setCuisineType(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select cuisine...</option>
                    {cuisineOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipe Image
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/30 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={imageUploading}
                  />
                  {imageUploading ? (
                    <div className="py-4 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Uploading to ImgBB...
                      </p>
                    </div>
                  ) : recipeImage ? (
                    <div className="flex items-center justify-between bg-slate-100 dark:bg-zinc-800 p-2 rounded-lg">
                      <img
                        src={recipeImage}
                        alt="Recipe"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="text-xs truncate max-w-xs px-2 text-slate-600 dark:text-zinc-300">
                        {recipeImage}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRecipeImage("")}
                        className="text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Click or Drag to upload image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Salad">Salad</option>
                    <option value="Fastfood">Fastfood</option>
                    <option value="Noodles">Noodles</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Piza">Piza</option>
                    <option value="Pasta">Pasta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    required
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-transparent outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                    placeholder="45"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ingredients * (one per line)
                </label>
                <textarea
                  required
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-transparent outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  placeholder="2 cups pasta\n1 cup heavy cream\n3 cloves garlic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Instructions Steps * (one step per line)
                </label>
                <textarea
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-transparent outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  placeholder="Boil water and cook pasta until al dente.\nSauté garlic in butter until fragrant.\nAdd cream and bring to a simmer."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-5 py-3 border border-slate-300 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || imageUploading}
                  className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition disabled:opacity-50 shadow-md"
                >
                  {loading ? "Saving..." : editId ? "Update Recipe" : "Submit Recipe"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
