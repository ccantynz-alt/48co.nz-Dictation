import type { drizzle } from "drizzle-orm/libsql";
import type * as schema from "./schema.js";

export type Database = ReturnType<typeof drizzle<typeof schema>>;
