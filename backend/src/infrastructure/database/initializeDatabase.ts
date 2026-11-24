import type { Pool } from "pg";

export const initializeDatabase = async (pool: Pool): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registered_faces (
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS registered_faces_name_unique_idx
    ON registered_faces (LOWER(name))
  `);
};
