import { drizzle } from 'drizzle-orm/neon-http';
export const db = drizzle(
  // Server-only name preferred; the NEXT_PUBLIC_ one is kept for older setups.
  (process.env.NEON_DB_CONNECTION_STRING ?? process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!)
);