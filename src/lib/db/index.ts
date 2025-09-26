import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env.server";
import * as schema from "./schema";

// For now, we'll use the Neon serverless driver for both development and production
// Hyperdrive can still optimize the connection at the network layer
const sql = neon(env.DATABASE_URL || "");

export const db = drizzle({
  schema,
  client: sql,
});

export type DB = typeof db;
