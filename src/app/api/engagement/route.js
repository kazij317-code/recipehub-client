import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const likesCollection = db.collection("recipeLikes");
  const favoritesCollection = db.collection("recipeFavorites");

  const [likesCount, favoritesCount] = await Promise.all([
    likesCollection.countDocuments(),
    favoritesCollection.countDocuments(),
  ]);

  return NextResponse.json({ count: likesCount + favoritesCount, likesCount, favoritesCount });
}
