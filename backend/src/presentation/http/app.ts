import express, { type Express } from "express";
import { FaceController } from "./controllers/FaceController";
import { HealthController } from "./controllers/HealthController";
import { createFaceRouter } from "./routes/faceRoutes";
import { createHealthRouter } from "./routes/healthRoutes";

export const createApp = (
  healthController: HealthController,
  faceController: FaceController,
): Express => {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use("/health", createHealthRouter(healthController));
  app.use("/api/faces", createFaceRouter(faceController));
  return app;
};
