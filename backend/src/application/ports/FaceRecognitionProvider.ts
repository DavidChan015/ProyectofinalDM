import type { FacePayload } from "../dtos/FacePayload";

export interface FaceRecognitionProvider {
  register(payload: FacePayload): Promise<unknown>;
  verify(payload: FacePayload): Promise<unknown>;
}
