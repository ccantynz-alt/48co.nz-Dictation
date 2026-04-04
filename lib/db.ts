import { neon } from '@neondatabase/serverless';

/**
 * Check whether DATABASE_URL is configured.
 * Use this to gate database-dependent logic so the app degrades
 * gracefully when no database is available.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function getConnectionString() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  return url;
}

export function getDb() {
  return neon(getConnectionString());
}

export async function query(sql: string, params: unknown[] = []) {
  const db = getDb();
  return db.query(sql, params);
}
