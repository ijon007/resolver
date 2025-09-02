import { db } from "@/db/db";
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schemas/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }), 
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
})
