import { FaceNotRegisteredError } from "../errors/FaceErrors";
import type { FacePayload } from "../dtos/FacePayload";
import type { FaceRecognitionProvider } from "../ports/FaceRecognitionProvider";
import type { RegisteredFaceRepository } from "../ports/RegisteredFaceRepository";
import { validateFacePayload } from "./validateFacePayload";

export class VerifyFace {
  constructor(
    private readonly faces: RegisteredFaceRepository,
    private readonly recognitionProvider: FaceRecognitionProvider,
  ) {}

  async execute(input: FacePayload): Promise<unknown> {
    const payload = validateFacePayload(input);

    if (!(await this.faces.existsByName(payload.nombre))) {
      throw new FaceNotRegisteredError();
    }

    return this.recognitionProvider.verify(payload);
  }
}
