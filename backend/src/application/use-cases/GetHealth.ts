import type { DatabaseHealthRepository } from "../ports/DatabaseHealthRepository";

export interface HealthStatus {
  status: "ok";
  database: "connected";
  timestamp: string;
}

export class GetHealth {
  constructor(private readonly databaseHealthRepository: DatabaseHealthRepository) {}

  async execute(): Promise<HealthStatus> {
    await this.databaseHealthRepository.checkConnection();

    return {
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    };
  }
}
