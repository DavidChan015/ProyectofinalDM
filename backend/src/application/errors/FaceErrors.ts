export class InvalidFacePayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidFacePayloadError";
  }
}

export class FaceAlreadyRegisteredError extends Error {
  constructor() {
    super("A face is already registered for this name.");
    this.name = "FaceAlreadyRegisteredError";
  }
}

export class FaceNotRegisteredError extends Error {
  constructor() {
    super("No face is registered for this name.");
    this.name = "FaceNotRegisteredError";
  }
}

export class FaceRecognitionServiceError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "FaceRecognitionServiceError";
  }
}
