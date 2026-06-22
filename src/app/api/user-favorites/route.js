import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  if (!email) {
    return NextResponse.json({ count: 0, data: [] });
  }

  const db = await getDb();
  const favoritesCollection = db.collection("recipeFavorites");
  const favorites = await favoritesCollection.find({ userEmail: email }).toArray();

  return NextResponse.json({ count: favorites.length, data: favorites });
}
