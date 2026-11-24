import type { Request, Response } from "express";
import {
  FaceAlreadyRegisteredError,
  FaceNotRegisteredError,
  FaceRecognitionServiceError,
  InvalidFacePayloadError,
} from "../../../application/errors/FaceErrors";
import type { FacePayload } from "../../../application/dtos/FacePayload";
import { RegisterFace } from "../../../application/use-cases/RegisterFace";
import { VerifyFace } from "../../../application/use-cases/VerifyFace";

export class FaceController {
  constructor(
    private readonly registerFace: RegisterFace,
    private readonly verifyFace: VerifyFace,
  ) {}

  register = async (request: Request, response: Response): Promise<void> => {
    const payload = this.parsePayload(request.body, response);
    if (!payload) return;

    try {
      response.status(200).json(await this.registerFace.execute(payload));
    } catch (error) {
      this.sendError(error, response);
    }
  };

  verify = async (request: Request, response: Response): Promise<void> => {
    const payload = this.parsePayload(request.body, response);
    if (!payload) return;

    try {
      response.status(200).json(await this.verifyFace.execute(payload));
    } catch (error) {
      this.sendError(error, response);
    }
  };

  private parsePayload(body: unknown, response: Response): FacePayload | null {
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      response.status(400).json({ error: "Request body must be an object." });
      return null;
    }

    const candidate = body as Record<string, unknown>;
    if (typeof candidate.nombre !== "string" || typeof candidate.image !== "string") {
      response.status(400).json({ error: "nombre and image are required." });
      return null;
    }

    return { nombre: candidate.nombre, image: candidate.image };
  }

  private sendError(error: unknown, response: Response): void {
    if (error instanceof InvalidFacePayloadError) {
      response.status(400).json({ error: error.message });
      return;
    }

    if (error instanceof FaceAlreadyRegisteredError) {
      response.status(409).json({ error: error.message });
      return;
    }

    if (error instanceof FaceNotRegisteredError) {
      response.status(404).json({ error: error.message });
      return;
    }

    console.error("Face operation failed:", error);
    const status = error instanceof FaceRecognitionServiceError ? 502 : 500;
    response.status(status).json({
      error: status === 502 ? "Face recognition service is unavailable." : "Internal server error.",
    });
  }
}
