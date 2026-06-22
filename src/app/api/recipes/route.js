import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const recipesCollection = db.collection("recipes");

  try {
    const recipes = await recipesCollection.find({}).toArray();
    return NextResponse.json({ data: recipes, status: true });
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    return NextResponse.json(
      { message: "Failed to fetch recipes", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const body = await request.json();
  const db = await getDb();
  const recipesCollection = db.collection("recipes");

  try {
    const recipe = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await recipesCollection.insertOne(recipe);

    return NextResponse.json({
      status: true,
      message: "Recipe created successfully",
      data: { id: result.insertedId, ...recipe },
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { message: "Failed to create recipe", error: error.message },
      { status: 500 }
    );
  }
}
