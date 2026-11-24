import type { Pool } from "pg";
import type { RegisteredFaceRepository } from "../../application/ports/RegisteredFaceRepository";

export class PostgresRegisteredFaceRepository implements RegisteredFaceRepository {
  constructor(private readonly pool: Pool) {}

  async existsByName(name: string): Promise<boolean> {
    const result = await this.pool.query(
      "SELECT 1 FROM registered_faces WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [name],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async register(name: string): Promise<boolean> {
    const result = await this.pool.query(
      `INSERT INTO registered_faces (name)
       VALUES ($1)
       ON CONFLICT DO NOTHING
       RETURNING name`,
      [name],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
