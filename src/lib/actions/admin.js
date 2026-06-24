"use server";

import { getDb } from "../db";
import { ObjectId } from "mongodb";
import { getUserSession } from "../session/session";

const seedMockDataIfNeeded = async (db) => {
  // 1. Seed users if only 1 user exists
  const usersCount = await db.collection("user").countDocuments();
  if (usersCount <= 1) {
    const mockUsers = [
      { email: "admin@gmail.com", name: "Admin", role: "admin", plan: "free", status: "active", createdAt: new Date("2026-06-16T10:00:00Z") },
      { email: "a@gmail.com", name: "Abc", role: "user", plan: "premium", status: "active", createdAt: new Date("2026-06-14T10:00:00Z") },
      { email: "a@b.com", name: "Nasib", role: "admin", plan: "premium", status: "active", createdAt: new Date("2026-06-14T10:00:00Z") },
      { email: "mehedi.hasan@gmail.com", name: "Mehedi Hasan", role: "admin", plan: "free", status: "active", createdAt: new Date("2026-01-20T10:00:00Z") },
      { email: "sadia.noor@gmail.com", name: "Sadia Noor", role: "user", plan: "premium", status: "active", createdAt: new Date("2026-01-18T10:00:00Z") },
      { email: "rafi.islam@gmail.com", name: "Rafi Islam", role: "user", plan: "free", status: "blocked", createdAt: new Date("2026-01-16T10:00:00Z") },
      { email: "sabbir.hossain@gmail.com", name: "Sabbir Hossain", role: "user", plan: "free", status: "active", createdAt: new Date("2026-01-12T10:00:00Z") },
      { email: "mim.akter@gmail.com", name: "Mim Akter", role: "user", plan: "premium", status: "active", createdAt: new Date("2026-01-10T10:00:00Z") },
      { email: "fahim.hasan@gmail.com", name: "Fahim Hasan", role: "user", plan: "free", status: "active", createdAt: new Date("2026-01-08T10:00:00Z") },
    ];
    for (const mu of mockUsers) {
      await db.collection("user").updateOne({ email: mu.email }, { $setOnInsert: mu }, { upsert: true });
    }
  }

  // 2. Seed recipes if only few exist (or seed standard ones from Image 2)
  const recipesCount = await db.collection("recipes").countDocuments();
  if (recipesCount <= 3) {
    const mockRecipes = [
      { recipeName: "Pasta", userEmail: "a@gmail.com", authorName: "Abc", category: "Breakfast", likesCount: 1, isLocked: false, isFeatured: false, recipeImage: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&q=80", createdAt: new Date("2026-06-16T10:00:00Z") },
      { recipeName: "Caesar Salad", userEmail: "ayesha.rahman@gmail.com", authorName: "Ayesha Rahman", category: "Salad", likesCount: 72, isLocked: false, isFeatured: false, recipeImage: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80", createdAt: new Date("2026-06-14T10:00:00Z") },
      { recipeName: "Mexican Beef Tacos", userEmail: "mehedi.hasan@gmail.com", authorName: "Mehedi Hasan", category: "Fast Food", likesCount: 119, isLocked: false, isFeatured: false, recipeImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", createdAt: new Date("2026-05-17T10:00:00Z") },
      { recipeName: "Chicken Shawarma Wrap", userEmail: "sadia.noor@gmail.com", authorName: "Sadia Noor", category: "Fast Food", likesCount: 156, isLocked: false, isFeatured: false, recipeImage: "https://images.unsplash.com/photo-1561651823-34fed0225408?w=400&q=80", createdAt: new Date("2026-05-18T10:00:00Z") },
      { recipeName: "Pad Thai", userEmail: "rafi.islam@gmail.com", authorName: "Rafi Islam", category: "Noodles", likesCount: 127, isLocked: false, isFeatured: false, recipeImage: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&q=80", createdAt: new Date("2026-05-16T10:00:00Z") },
      { recipeName: "Sushi Roll", userEmail: "sabbir.hossain@gmail.com", authorName: "Sabbir Hossain", category: "Seafood", likesCount: 175, isLocked: false, isFeatured: false, recipeImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80", createdAt: new Date("2026-05-12T10:00:00Z") },
      { recipeName: "Margherita Pizza", userEmail: "mim.akter@gmail.com", authorName: "Mim Akter", category: "Pizza", likesCount: 210, isLocked: false, isFeatured: false, recipeImage: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", createdAt: new Date("2026-05-10T10:00:00Z") },
      { recipeName: "Pasta Alfredo", userEmail: "fahim.hasan@gmail.com", authorName: "Fahim Hasan", category: "Pasta", likesCount: 89, isLocked: false, isFeatured: true, recipeImage: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&q=80", createdAt: new Date("2026-05-08T10:00:00Z") },
    ];
    for (const mr of mockRecipes) {
      await db.collection("recipes").updateOne({ recipeName: mr.recipeName }, { $setOnInsert: mr }, { upsert: true });
    }
  }

  // 3. Seed reports if empty
  const reportsCount = await db.collection("recipeReports").countDocuments();
  if (reportsCount === 0) {
    const mockReports = [
      { recipeId: "pasta-id-placeholder", reporterEmail: "a@gmail.com", reason: "Offensive Content", description: "—", status: "pending", createdAt: new Date("2026-06-16T10:00:00Z") },
      { recipeId: "caesar-salad-id-placeholder", reporterEmail: "a@gmail.com", reason: "Spam", description: "Offensive", status: "pending", createdAt: new Date("2026-06-14T10:00:00Z") },
      { recipeId: "mexican-tacos-id-placeholder", reporterEmail: "tanvir.ahmed@gmail.com", reason: "Spam", description: "—", status: "pending", createdAt: new Date("2026-05-10T10:00:00Z") },
      { recipeId: "chicken-wrap-id-placeholder", reporterEmail: "mehedi.hasan@gmail.com", reason: "Spam", description: "—", status: "pending", createdAt: new Date("2026-05-17T10:00:00Z") },
      { recipeId: "pad-thai-id-placeholder", reporterEmail: "sabbir.hossain@gmail.com", reason: "Spam", description: "—", status: "pending", createdAt: new Date("2026-05-04T10:00:00Z") },
      { recipeId: "sushi-roll-id-placeholder", reporterEmail: "tanvir.ahmed@gmail.com", reason: "Spam", description: "—", status: "pending", createdAt: new Date("2026-05-01T10:00:00Z") },
    ];

    const allRecipes = await db.collection("recipes").find().toArray();
    for (let i = 0; i < mockReports.length; i++) {
      const rep = mockReports[i];
      const match = allRecipes[i % allRecipes.length];
      if (match) {
        rep.recipeId = match._id.toString();
      }
      await db.collection("recipeReports").insertOne(rep);
    }
  }

  // 4. Seed transactions if empty or missing premium upgrades
  const premiumCount = await db.collection("purchases").countDocuments({ paymentType: "premium_upgrade" });
  if (premiumCount === 0) {
    const mockPurchases = [
      { userEmail: "a@gmail.com", paymentType: "premium_upgrade", amount: "$9.99", sessionId: "cs_test_a1GRXySl...", createdAt: new Date("2026-06-16T10:00:00Z") },
      { userEmail: "a@gmail.com", paymentType: "recipe_purchase", amount: "$4.99", sessionId: "cs_test_a1xw8HiR...", createdAt: new Date("2026-06-16T10:00:00Z") },
      { userEmail: "a@gmail.com", paymentType: "recipe_purchase", amount: "$4.99", sessionId: "cs_test_a1XGr@ci...", createdAt: new Date("2026-06-16T10:00:00Z") },
      { userEmail: "a@gmail.com", paymentType: "recipe_purchase", amount: "$4.99", sessionId: "cs_test_a1RHz2o2...", createdAt: new Date("2026-06-14T10:00:00Z") },
      { userEmail: "a@b.com", paymentType: "recipe_purchase", amount: "$4.99", sessionId: "cs_test_a10swNF1...", createdAt: new Date("2026-06-14T10:00:00Z") },
      { userEmail: "a@b.com", paymentType: "recipe_purchase", amount: "$4.99", sessionId: "test_txn_1781447...", createdAt: new Date("2026-06-14T10:00:00Z") },
      { userEmail: "a@b.com", paymentType: "recipe_purchase", amount: "$4.99", sessionId: "test_txn_1781448...", createdAt: new Date("2026-06-14T10:00:00Z") },
      { userEmail: "a@b.com", paymentType: "premium_upgrade", amount: "$9.99", sessionId: "test_txn_premium...", createdAt: new Date("2026-06-14T10:00:00Z") },
      { userEmail: "nusrat.jahan@gmail.com", paymentType: "recipe_purchase", amount: "$0.02", sessionId: "pi_3Rq8HiLhY7A1B...", createdAt: new Date("2026-04-10T10:00:00Z") },
      { userEmail: "ayesha.rahman@gmail.com", paymentType: "recipe_purchase", amount: "$0.04", sessionId: "pi_3Rq8GhLhY7A1B...", createdAt: new Date("2026-04-09T10:00:00Z") },
      { userEmail: "mehedi.hasan@gmail.com", paymentType: "recipe_purchase", amount: "$0.03", sessionId: "pi_3Rq8FgLhY7A1B...", createdAt: new Date("2026-04-08T10:00:00Z") },
    ];
    for (const mp of mockPurchases) {
      await db.collection("purchases").updateOne(
        { sessionId: mp.sessionId },
        { $setOnInsert: mp },
        { upsert: true }
      );
    }
  }
};

const verifyAdmin = async () => {
  const user = await getUserSession();
  if (user?.role !== "admin") {
    throw new Error("Unauthorized. Admin access required.");
  }
  return user;
};

export const fetchAdminOverviewStats = async () => {
  await verifyAdmin();
  const db = await getDb();
  await seedMockDataIfNeeded(db);

  const [usersCount, recipesCount, premiumCount, reportsCount] = await Promise.all([
    db.collection("user").countDocuments({ email: { $nin: ["a@gmail.com", "a@b.com"] } }),
    db.collection("recipes").countDocuments(),
    db.collection("user").countDocuments({ plan: "premium", email: { $nin: ["a@gmail.com", "a@b.com"] } }),
    db.collection("recipeReports").countDocuments({ status: "pending", reporterEmail: { $nin: ["a@gmail.com", "a@b.com"] } }),
  ]);

  return {
    usersCount,
    recipesCount,
    premiumCount,
    reportsCount,
  };
};

export const fetchAllUsersAdmin = async () => {
  await verifyAdmin();
  const db = await getDb();
  await seedMockDataIfNeeded(db);
  const users = await db.collection("user").find({
    email: { $nin: ["a@gmail.com", "a@b.com"] }
  }).toArray();

  return users.map(u => ({
    ...u,
    _id: u._id.toString(),
  }));
};

export const updateUserRoleAdmin = async (userId, newRole) => {
  await verifyAdmin();
  const db = await getDb();
  let objectId;
  try {
    objectId = new ObjectId(userId);
  } catch (e) {
    throw new Error("Invalid User ID");
  }

  await db.collection("user").updateOne({ _id: objectId }, { $set: { role: newRole } });
  return { success: true };
};

export const toggleUserBlockAdmin = async (userId, currentStatus) => {
  await verifyAdmin();
  const db = await getDb();
  let objectId;
  try {
    objectId = new ObjectId(userId);
  } catch (e) {
    throw new Error("Invalid User ID");
  }

  const nextStatus = currentStatus === "blocked" ? "active" : "blocked";
  await db.collection("user").updateOne({ _id: objectId }, { $set: { status: nextStatus } });
  return { success: true, status: nextStatus };
};

export const deleteUserAdmin = async (userId) => {
  await verifyAdmin();
  const db = await getDb();
  let objectId;
  try {
    objectId = new ObjectId(userId);
  } catch (e) {
    throw new Error("Invalid User ID");
  }

  await db.collection("user").deleteOne({ _id: objectId });
  return { success: true };
};

export const fetchAllRecipesAdmin = async () => {
  await verifyAdmin();
  const db = await getDb();
  await seedMockDataIfNeeded(db);
  const recipes = await db.collection("recipes").find().toArray();

  return recipes.map(r => ({
    ...r,
    _id: r._id.toString(),
  }));
};

export const toggleRecipeLockAdmin = async (recipeId) => {
  await verifyAdmin();
  const db = await getDb();
  let objectId;
  let recipe;

  try {
    objectId = new ObjectId(recipeId);
    recipe = await db.collection("recipes").findOne({ _id: objectId });
  } catch (e) {
    recipe = await db.collection("recipes").findOne({ id: recipeId });
  }

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  const newLockStatus = !recipe.isLocked;

  if (objectId) {
    await db.collection("recipes").updateOne({ _id: objectId }, { $set: { isLocked: newLockStatus } });
  } else {
    await db.collection("recipes").updateOne({ id: recipeId }, { $set: { isLocked: newLockStatus } });
  }

  return { success: true, isLocked: newLockStatus };
};

export const toggleRecipeFeaturedAdmin = async (recipeId) => {
  await verifyAdmin();
  const db = await getDb();
  let objectId;
  let recipe;

  try {
    objectId = new ObjectId(recipeId);
    recipe = await db.collection("recipes").findOne({ _id: objectId });
  } catch (e) {
    recipe = await db.collection("recipes").findOne({ id: recipeId });
  }

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  const newFeaturedStatus = !recipe.isFeatured;

  if (objectId) {
    await db.collection("recipes").updateOne({ _id: objectId }, { $set: { isFeatured: newFeaturedStatus } });
  } else {
    await db.collection("recipes").updateOne({ id: recipeId }, { $set: { isFeatured: newFeaturedStatus } });
  }

  return { success: true, isFeatured: newFeaturedStatus };
};

export const deleteRecipeAdmin = async (recipeId) => {
  await verifyAdmin();
  const db = await getDb();
  let objectId;
  let matched = false;

  try {
    objectId = new ObjectId(recipeId);
    const result = await db.collection("recipes").deleteOne({ _id: objectId });
    matched = result.deletedCount > 0;
  } catch (e) {
    const result = await db.collection("recipes").deleteOne({ id: recipeId });
    matched = result.deletedCount > 0;
  }

  if (!matched) {
    throw new Error("Recipe not found");
  }

  return { success: true };
};

export const fetchAllReportsAdmin = async () => {
  await verifyAdmin();
  const db = await getDb();
  await seedMockDataIfNeeded(db);

  const reports = await db.collection("recipeReports").find({
    reporterEmail: { $nin: ["a@gmail.com", "a@b.com"] }
  }).sort({ createdAt: -1 }).toArray();

  const recipeIds = reports.map(r => {
    try {
      return new ObjectId(r.recipeId);
    } catch (e) {
      return r.recipeId;
    }
  });

  const recipes = await db.collection("recipes").find({
    $or: [
      { _id: { $in: recipeIds.filter(id => id instanceof ObjectId) } },
      { id: { $in: reports.map(r => r.recipeId) } }
    ]
  }).toArray();

  return reports.map(r => {
    const recipe = recipes.find(rec => String(rec._id) === String(r.recipeId) || String(rec.id) === String(r.recipeId));
    return {
      ...r,
      _id: r._id.toString(),
      recipeName: recipe?.recipeName || "Unknown Recipe",
      recipeImage: recipe?.recipeImage || "",
    };
  });
};

export const resolveReportAdmin = async (reportId, actionType) => {
  await verifyAdmin();
  const db = await getDb();
  let objectId;
  try {
    objectId = new ObjectId(reportId);
  } catch (e) {
    throw new Error("Invalid Report ID");
  }

  await db.collection("recipeReports").updateOne(
    { _id: objectId },
    { $set: { status: "resolved", actionTaken: actionType, resolvedAt: new Date() } }
  );
  return { success: true };
};

export const reportRecipeIssue = async (recipeId, userEmail, reason, description) => {
  const user = await getUserSession();
  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const db = await getDb();

  // Prevent duplicate reports by the same user
  const existingReport = await db.collection("recipeReports").findOne({
    recipeId,
    reporterEmail: userEmail,
  });

  if (existingReport) {
    return { success: false, error: "You have already reported this recipe." };
  }

  const report = {
    recipeId,
    reporterEmail: userEmail,
    reason: reason || "Spam",
    description: description || "—",
    status: "pending",
    createdAt: new Date(),
  };

  const result = await db.collection("recipeReports").insertOne(report);
  return { success: true, reportId: result.insertedId.toString() };
};

export const fetchAllTransactionsAdmin = async () => {
  await verifyAdmin();
  const db = await getDb();
  await seedMockDataIfNeeded(db);
  const transactions = await db.collection("purchases").find({
    userEmail: { $nin: ["a@gmail.com", "a@b.com", "nusrat.jahan@gmail.com", "ayesha.rahman@gmail.com", "mehedi.hasan@gmail.com"] }
  }).sort({ createdAt: -1 }).toArray();

  return transactions.map(t => ({
    ...t,
    _id: t._id.toString(),
  }));
};
