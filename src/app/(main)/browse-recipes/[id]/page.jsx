import RecipeDetailsClient from "@/components/RecipeDetailsClient";

const RecipeDetailsPage = ({ params }) => {
  const idFromParams = params?.id ?? params?.recipeId ??
    (params && Object.values(params)[0]);

  return <RecipeDetailsClient fallbackId={idFromParams} />;
};

export default RecipeDetailsPage;
