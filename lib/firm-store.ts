import { FirmProfile } from './firm-profiles';

/**
 * In-memory store for firm profiles.
 * When the database (Neon PostgreSQL) is connected in Phase 2,
 * this will be replaced with proper database queries.
 */
const store: Map<string, FirmProfile> = (() => {
  if (!(globalThis as any).__firmStore) {
    (globalThis as any).__firmStore = new Map<string, FirmProfile>();
  }
  return (globalThis as any).__firmStore;
})();

export const firmStore = store;
