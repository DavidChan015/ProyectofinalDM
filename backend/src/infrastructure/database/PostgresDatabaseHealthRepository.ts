import type { Pool } from "pg";
import type { DatabaseHealthRepository } from "../../application/ports/DatabaseHealthRepository";

export class PostgresDatabaseHealthRepository implements DatabaseHealthRepository {
  constructor(private readonly pool: Pool) {}

  async checkConnection(): Promise<void> {
    await this.pool.query("SELECT 1");
  }
}
