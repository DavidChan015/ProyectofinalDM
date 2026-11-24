import {
  FaceAlreadyRegisteredError,
} from "../errors/FaceErrors";
import type { FaceRecognitionProvider } from "../ports/FaceRecognitionProvider";
import type { RegisteredFaceRepository } from "../ports/RegisteredFaceRepository";
import type { FacePayload } from "../dtos/FacePayload";
import { validateFacePayload } from "./validateFacePayload";

export class RegisterFace {
  constructor(
    private readonly faces: RegisteredFaceRepository,
    private readonly recognitionProvider: FaceRecognitionProvider,
  ) {}

  async execute(input: FacePayload): Promise<unknown> {
    const payload = validateFacePayload(input);

    if (await this.faces.existsByName(payload.nombre)) {
      throw new FaceAlreadyRegisteredError();
    }

    const providerResponse = await this.recognitionProvider.register(payload);
    const inserted = await this.faces.register(payload.nombre);

    if (!inserted) {
      throw new FaceAlreadyRegisteredError();
    }

    return providerResponse;
  }
}
