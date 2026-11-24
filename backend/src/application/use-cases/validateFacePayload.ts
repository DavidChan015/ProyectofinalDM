import { InvalidFacePayloadError } from "../errors/FaceErrors";
import type { FacePayload } from "../dtos/FacePayload";

const BASE64_IMAGE_PATTERN =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const MAX_IMAGE_BASE64_LENGTH = 8 * 1024 * 1024;

export const validateFacePayload = (payload: FacePayload): FacePayload => {
  const nombre = payload.nombre.trim();
  const image = payload.image.trim();

  if (!nombre || nombre.length > 100) {
    throw new InvalidFacePayloadError("nombre must contain between 1 and 100 characters.");
  }

  if (
    !image ||
    image.length > MAX_IMAGE_BASE64_LENGTH ||
    image.length % 4 !== 0 ||
    !BASE64_IMAGE_PATTERN.test(image)
  ) {
    throw new InvalidFacePayloadError("image must be a valid base64-encoded image.");
  }

  return { nombre, image };
};
