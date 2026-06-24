import React, { Suspense } from "react";
import AddRecipeForm from "./AddRecipeForm";
import { getUserSession } from "@/lib/session/session";
import { fetchUserRecipes } from "@/lib/actions/recipe";

const AddRecipePage = async () => {
  const sessionUser = await getUserSession();
  const recipesResponse = await fetchUserRecipes(sessionUser?.email);
  const recipes = recipesResponse?.data || [];

  const user = sessionUser ? {
    ...sessionUser,
    totalRecipesCreated: recipes.length,
    isPremium: sessionUser.plan === "premium" || sessionUser.isPremium || false,
  } : null;

  return (
    <div>
      {user ? (
        <Suspense fallback={<p className="text-center p-10">Loading form...</p>}>
          <AddRecipeForm user={user} />
        </Suspense>
      ) : (
        <p className="text-center p-10">Please log in to add a recipe.</p>
      )}
    </div>
  );
};

export default AddRecipePage;
