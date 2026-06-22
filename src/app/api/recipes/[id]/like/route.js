import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  const recipeId = params?.id;
  if (!recipeId) {
    return NextResponse.json({ message: "Recipe id is required." }, { status: 400 });
  }

  const db = await getDb();
  const likesCollection = db.collection("recipeLikes");
  const likesCount = await likesCollection.countDocuments({ recipeId });

  return NextResponse.json({ status: true, likesCount });
}

export async function POST(request, { params }) {
  const session = await auth.api.getSession({ request });
  const userEmail = session?.user?.email;
  const recipeId = params?.id;

  if (!userEmail) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!recipeId) {
    return NextResponse.json({ message: "Recipe id is required." }, { status: 400 });
  }

  const db = await getDb();
  const likesCollection = db.collection("recipeLikes");

  const existingLike = await likesCollection.findOne({ recipeId, userEmail });
  if (existingLike) {
    const likesCount = await likesCollection.countDocuments({ recipeId });
    return NextResponse.json({ status: true, likesCount, message: "Already liked" });
  }

  await likesCollection.insertOne({ recipeId, userEmail, createdAt: new Date() });
  const likesCount = await likesCollection.countDocuments({ recipeId });

  return NextResponse.json({ status: true, likesCount, message: "Recipe liked" });
}
