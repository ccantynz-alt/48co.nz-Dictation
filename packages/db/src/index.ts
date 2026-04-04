/**
 * @btf/db — Drizzle ORM + Turso (libsql) database layer.
 * Edge-native SQLite with embedded replicas for zero-latency reads.
 */

import { drizzle } from "drizzle-orm/libsql";
import { createClient, type Config } from "@libsql/client";
import * as schema from "./schema.js";

export type { Database } from "./types.js";
export * from "./schema.js";

export function createDatabase(config: Config) {
	const client = createClient(config);
	return drizzle(client, { schema });
}
