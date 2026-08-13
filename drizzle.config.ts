import { defineConfig } from "drizzle-kit";
import "dotenv/config";

/**
 * Migrations run from Node against the Supabase Postgres directly. At runtime
 * the Workers use PostgREST instead, so this connection string is a build/ops
 * concern only — use the session pooler URI from Supabase (port 5432).
 */
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
