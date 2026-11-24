import type { Request, Response } from "express";
import { GetHealth } from "../../../application/use-cases/GetHealth";

export class HealthController {
  constructor(private readonly getHealth: GetHealth) {}

  handle = async (_request: Request, response: Response): Promise<void> => {
    try {
      const health = await this.getHealth.execute();
      response.status(200).json(health);
    } catch (error) {
      console.error("Database health check failed:", error);
      response.status(503).json({
        status: "unavailable",
        database: "unavailable",
      });
    }
  };
}
