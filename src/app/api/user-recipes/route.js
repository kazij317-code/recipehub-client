import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";

  if (!email) {
    return NextResponse.json({ count: 0, data: [] });
  }

  const db = await getDb();
  const recipesCollection = db.collection("recipes");

  try {
    const recipes = await recipesCollection.find({ userEmail: email }).toArray();
    return NextResponse.json({ data: recipes, count: recipes.length });
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    return NextResponse.json(
      { message: "Failed to fetch recipes", error: error.message },
      { status: 500 }
    );
  }
}
