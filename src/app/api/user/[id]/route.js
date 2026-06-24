import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function PATCH(request, { params }) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = params?.id;

  if (!userId || userId !== session.user.id) {
    return NextResponse.json(
      { message: "Invalid user ID" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const usersCollection = db.collection("user");

  try {
    // Increment the recipe count limit for the user
    const result = await usersCollection.updateOne(
      { _id: userId },
      { $inc: { limit: 1 } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: "User recipe limit updated",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}
