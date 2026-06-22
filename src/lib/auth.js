import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, bearer } from "better-auth/plugins";

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
});
