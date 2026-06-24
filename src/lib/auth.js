import { betterAuth } from "better-auth";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, bearer } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db("recipehub_db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {        
      google: {             
        clientId: process.env.GOOGLE_CLIENT_ID,             
        clientSecret: process.env.GOOGLE_SECRET,        
      }     
    },

  user: {
    additionalFields: {
      role: {
        defaultValue: "user",
      },
      plan: {
        defaultValue: "free",
      },
      limit: {
        defaultValue: 0,
      },
      isPremium: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 60,
    },
  },
  plugins: [jwt(), bearer()],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-in")) {
        const body = ctx.body;
        const email = body?.email;
        if (email) {
          const userDoc = await db.collection("user").findOne({ email });
          if (userDoc && userDoc.status === "blocked") {
            throw new APIError("UNAUTHORIZED", {
              message: "user blocked by admin",
            });
          }
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/get-session") || ctx.path.startsWith("/session")) {
        const user = ctx.context.session?.user || ctx.context.user;
        if (user) {
          const userDoc = await db.collection("user").findOne({ email: user.email });
          if (userDoc && userDoc.status === "blocked") {
            throw new APIError("UNAUTHORIZED", {
              message: "user blocked by admin",
            });
          }
        }
      }
    }),
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const userDoc = await db.collection("user").findOne({
            $or: [
              { _id: typeof session.userId === "string" && session.userId.length === 24 ? new ObjectId(session.userId) : session.userId },
              { id: session.userId }
            ]
          });
          if (userDoc && userDoc.status === "blocked") {
            throw new Error("user blocked by admin");
          }
        }
      }
    }
  },
});
