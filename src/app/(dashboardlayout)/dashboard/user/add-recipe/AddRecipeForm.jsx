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
    <div className="bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 py-10 px-4 transition-colors duration-300 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {hasReachedLimit ? (
          /* Premium Subscription Card (Shown when free limit is exceeded) */
          <div className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-950 dark:to-zinc-900 dark:border-amber-500/20 p-8 rounded-3xl text-center max-w-xl mx-auto mt-12 shadow-xl">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
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
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition shadow-md cursor-pointer"
            >
              Become a Premium Member
            </button>
          </div>
        ) : (
          /* ✅ Redesigned Recipe Form */
          <div className="backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border border-slate-200/60 dark:border-zinc-800/60 p-6 md:p-10 rounded-3xl shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border-b border-slate-100 dark:border-zinc-800/80 pb-6 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {editId ? "Edit " : "Create "}
                  <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {editId ? "Recipe 🍳" : "New Recipe 🍲"}
                  </span>
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  {editId ? "Refine your recipe details and update your listing" : "Share your culinary masterpieces with our global food community"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Side: General Info & Image */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
                    General Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                        Recipe Name
                      </label>
                      <input
                        type="text"
                        required
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        className="w-full px-4 h-12 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g., Kacchi Biryani"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                        Cuisine Type
                      </label>
                      <select
                        required
                        value={cuisineType}
                        onChange={(e) => setCuisineType(e.target.value)}
                        className="w-full px-4 h-12 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 text-slate-900 dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 cursor-pointer"
                      >
                        <option value="" className="dark:bg-zinc-900">Select cuisine...</option>
                        {cuisineOptions.map((option) => (
                          <option key={option} value={option} className="dark:bg-zinc-900">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                        Category
                      </label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 h-12 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 text-slate-900 dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 cursor-pointer"
                      >
                        <option value="" className="dark:bg-zinc-900">Select Category</option>
                        <option value="Breakfast" className="dark:bg-zinc-900">Breakfast</option>
                        <option value="Lunch" className="dark:bg-zinc-900">Lunch</option>
                        <option value="Dinner" className="dark:bg-zinc-900">Dinner</option>
                        <option value="Dessert" className="dark:bg-zinc-900">Dessert</option>
                        <option value="Salad" className="dark:bg-zinc-900">Salad</option>
                        <option value="Fastfood" className="dark:bg-zinc-900">Fastfood</option>
                        <option value="Noodles" className="dark:bg-zinc-900">Noodles</option>
                        <option value="Seafood" className="dark:bg-zinc-900">Seafood</option>
                        <option value="Piza" className="dark:bg-zinc-900">Piza</option>
                        <option value="Pasta" className="dark:bg-zinc-900">Pasta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-4 h-12 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 text-slate-900 dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 cursor-pointer"
                      >
                        <option value="Easy" className="dark:bg-zinc-900">Easy</option>
                        <option value="Medium" className="dark:bg-zinc-900">Medium</option>
                        <option value="Hard" className="dark:bg-zinc-900">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                        Prep Time (mins)
                      </label>
                      <input
                        type="number"
                        required
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        className="w-full px-4 h-12 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="45"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                      Recipe Image
                    </label>
                    <div className="border-2 border-dashed border-slate-200 dark:border-zinc-700 hover:border-cyan-500 dark:hover:border-cyan-500/60 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 relative group flex flex-col justify-center min-h-[140px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        disabled={imageUploading}
                      />
                      {imageUploading ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                            Uploading to ImgBB...
                          </p>
                        </div>
                      ) : recipeImage ? (
                        <div className="flex items-center justify-between bg-slate-100 dark:bg-zinc-850 p-2.5 rounded-xl border border-slate-200/50 dark:border-zinc-700/50">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={recipeImage}
                              alt="Recipe Preview"
                              className="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-zinc-700"
                            />
                            <span className="text-xs truncate max-w-[150px] md:max-w-[200px] text-slate-600 dark:text-zinc-300 font-medium">
                              {recipeImage}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRecipeImage("")}
                            className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors z-20 relative cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-5 h-5 text-slate-500 dark:text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                              Upload a cover image
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
                              Drag & drop or click to upload
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Ingredients & Instructions */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
                    Ingredients & Steps
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                      Ingredients (one per line)
                    </label>
                    <textarea
                      required
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white transition-all duration-200 text-sm font-medium resize-none"
                      placeholder="2 cups pasta&#10;1 cup heavy cream&#10;3 cloves garlic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                      Instructions Steps (one step per line)
                    </label>
                    <textarea
                      required
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={7}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white transition-all duration-200 text-sm font-medium resize-none"
                      placeholder="Boil water and cook pasta until al dente.&#10;Sauté garlic in butter until fragrant.&#10;Add cream and bring to a simmer."
                    />
                  </div>
                </div>

              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/80 pt-6 mt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 h-12 font-bold rounded-2xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || imageUploading}
                  className="px-8 h-12 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold rounded-2xl transition shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 cursor-pointer active:scale-[0.99] flex items-center justify-center"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : editId ? (
                    "Update Recipe"
                  ) : (
                    "Submit Recipe"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
