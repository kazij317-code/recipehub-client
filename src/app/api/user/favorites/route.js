import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(request) {
  const session = await auth.api.getSession({ request });
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const recipeId = body?.recipeId;

  if (!recipeId) {
    return NextResponse.json({ message: "recipeId is required." }, { status: 400 });
  }

  const db = await getDb();
  const favoritesCollection = db.collection("recipeFavorites");
  const existing = await favoritesCollection.findOne({ recipeId, userEmail });

  if (existing) {
    return NextResponse.json({ status: true, message: "Already in favorites", data: existing });
  }

  const inserted = await favoritesCollection.insertOne({ recipeId, userEmail, createdAt: new Date() });
  return NextResponse.json({ status: true, message: "Saved to favorites", data: { id: inserted.insertedId, recipeId } });
}

export async function DELETE(request) {
  const session = await auth.api.getSession({ request });
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const recipeId = body?.recipeId;

  if (!recipeId) {
    return NextResponse.json({ message: "recipeId is required." }, { status: 400 });
  }

  const db = await getDb();
  const favoritesCollection = db.collection("recipeFavorites");
  const result = await favoritesCollection.deleteOne({ recipeId, userEmail });

  if (result.deletedCount === 0) {
    return NextResponse.json({ status: false, message: "Favorite not found" }, { status: 404 });
  }

  return NextResponse.json({ status: true, message: "Removed from favorites" });
}

