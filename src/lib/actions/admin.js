"use server";

import { getDb } from "../db";
import { ObjectId } from "mongodb";
import { getUserSession } from "../session/session";

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

  const [usersCount, recipesCount, premiumCount, reportsCount] = await Promise.all([
    db.collection("user").countDocuments(),
    db.collection("recipes").countDocuments(),
    db.collection("user").countDocuments({ plan: "premium" }),
    db.collection("recipeReports").countDocuments({ status: "pending" }),
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
  const users = await db.collection("user").find().toArray();

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
  
  // Create an aggregation to lookup recipe info for reports
  const reports = await db.collection("recipeReports").find().sort({ createdAt: -1 }).toArray();

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

export const reportRecipeIssue = async (recipeId, userEmail, issueText) => {
  const user = await getUserSession();
  if (!user) {
    throw new Error("Unauthorized. Please log in.");
  }

  const db = await getDb();
  const report = {
    recipeId,
    reporterEmail: userEmail,
    issue: issueText,
    status: "pending",
    createdAt: new Date(),
  };

  const result = await db.collection("recipeReports").insertOne(report);
  return { success: true, reportId: result.insertedId.toString() };
};

export const fetchAllTransactionsAdmin = async () => {
  await verifyAdmin();
  const db = await getDb();
  const transactions = await db.collection("purchases").find().sort({ createdAt: -1 }).toArray();

  return transactions.map(t => ({
    ...t,
    _id: t._id.toString(),
  }));
};
