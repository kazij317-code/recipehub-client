import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  const recipeId = params?.id;

  if (!recipeId) {
    return NextResponse.json(
      { message: "Recipe ID is required" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const recipesCollection = db.collection("recipes");

  try {
    // Try to find by MongoDB _id first
    let recipe;
    try {
      const objectId = new ObjectId(recipeId);
      recipe = await recipesCollection.findOne({ _id: objectId });
    } catch (e) {
      // If not a valid ObjectId, try as string id
      recipe = await recipesCollection.findOne({ id: recipeId });
    }

    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: recipe, status: true });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { message: "Failed to fetch recipe", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const recipeId = params?.id;
  const body = await request.json();

  if (!recipeId) {
    return NextResponse.json(
      { message: "Recipe ID is required" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const recipesCollection = db.collection("recipes");

  try {
    // Try to update by MongoDB _id first
    let result;
    try {
      const objectId = new ObjectId(recipeId);
      result = await recipesCollection.updateOne(
        { _id: objectId },
        { $set: body }
      );
    } catch (e) {
      // If not a valid ObjectId, try as string id
      result = await recipesCollection.updateOne(
        { id: recipeId },
        { $set: body }
      );
    }

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: "Recipe updated successfully",
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { message: "Failed to update recipe", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const recipeId = params?.id;

  if (!recipeId) {
    return NextResponse.json(
      { message: "Recipe ID is required" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const recipesCollection = db.collection("recipes");

  try {
    // Try to delete by MongoDB _id first
    let result;
    try {
      const objectId = new ObjectId(recipeId);
      result = await recipesCollection.deleteOne({ _id: objectId });
    } catch (e) {
      // If not a valid ObjectId, try as string id
      result = await recipesCollection.deleteOne({ id: recipeId });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { message: "Failed to delete recipe", error: error.message },
      { status: 500 }
    );
  }
}
