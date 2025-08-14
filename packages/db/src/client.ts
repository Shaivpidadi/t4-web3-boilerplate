import { createClient } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

export const db = drizzle(
  createClient({
    connectionString: process.env.POSTGRES_URL,
  }),
  {
    schema,
    casing: "snake_case",
  }
);
