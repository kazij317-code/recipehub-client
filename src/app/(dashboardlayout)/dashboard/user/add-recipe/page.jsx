import React from "react";
import AddRecipeForm from "./AddRecipeForm";
import { getUserSession } from "@/lib/session/session";

const AddRecipePage = async () => {
  const user = await getUserSession();
  return (
    <div>
      <AddRecipeForm user={user} />
    </div>
  );
};

export default AddRecipePage;
