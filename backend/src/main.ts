import "dotenv/config";
import { Pool } from "pg";
import { GetHealth } from "./application/use-cases/GetHealth";
import { PostgresDatabaseHealthRepository } from "./infrastructure/database/PostgresDatabaseHealthRepository";
import { initializeDatabase } from "./infrastructure/database/initializeDatabase";
import { PostgresRegisteredFaceRepository } from "./infrastructure/database/PostgresRegisteredFaceRepository";
import { LambdaFaceRecognitionProvider } from "./infrastructure/providers/LambdaFaceRecognitionProvider";
import { createApp } from "./presentation/http/app";
import { FaceController } from "./presentation/http/controllers/FaceController";
import { HealthController } from "./presentation/http/controllers/HealthController";
import { RegisterFace } from "./application/use-cases/RegisterFace";
import { VerifyFace } from "./application/use-cases/VerifyFace";

const port = Number(process.env.PORT ?? 3000);
const requiredUrl = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} must be configured.`);
  }
  return new URL(value).toString();
};

const databasePool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const databaseHealthRepository = new PostgresDatabaseHealthRepository(databasePool);
const registeredFaceRepository = new PostgresRegisteredFaceRepository(databasePool);
const recognitionProvider = new LambdaFaceRecognitionProvider(
  requiredUrl("FACE_REGISTER_URL"),
  requiredUrl("FACE_VERIFY_URL"),
);
const healthController = new HealthController(new GetHealth(databaseHealthRepository));
const faceController = new FaceController(
  new RegisterFace(registeredFaceRepository, recognitionProvider),
  new VerifyFace(registeredFaceRepository, recognitionProvider),
);
const app = createApp(healthController, faceController);

const start = async (): Promise<void> => {
  await initializeDatabase(databasePool);
  app.listen(port, () => {
    console.log(`Backend escuchando en el puerto ${port}`);
  });
};

void start().catch((error: unknown) => {
  console.error("Backend startup failed:", error);
  process.exitCode = 1;
});
