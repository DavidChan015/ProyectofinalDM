import {
  FaceRecognitionServiceError,
} from "../../application/errors/FaceErrors";
import type { FacePayload } from "../../application/dtos/FacePayload";
import type { FaceRecognitionProvider } from "../../application/ports/FaceRecognitionProvider";

export class LambdaFaceRecognitionProvider implements FaceRecognitionProvider {
  constructor(
    private readonly registerUrl: string,
    private readonly verifyUrl: string,
  ) {}

  register(payload: FacePayload): Promise<unknown> {
    return this.send(this.registerUrl, payload);
  }

  verify(payload: FacePayload): Promise<unknown> {
    return this.send(this.verifyUrl, payload);
  }

  private async send(url: string, payload: FacePayload): Promise<unknown> {
    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error) {
      throw new FaceRecognitionServiceError("Face recognition provider could not be reached.", {
        cause: error,
      });
    }

    const body = await response.text();
    if (!response.ok) {
      throw new FaceRecognitionServiceError(
        `Face recognition provider returned HTTP ${response.status}.`,
      );
    }

    if (!body) {
      return null;
    }

    try {
      return JSON.parse(body) as unknown;
    } catch {
      return body;
    }
  }
}
