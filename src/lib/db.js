import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) {
  throw new Error("MONGO_DB_URI environment variable is required.");
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const getDb = async () => {
  const client = await clientPromise;
  return client.db(process.env.AUTH_DB_NAME || "recipehub_db");
};
