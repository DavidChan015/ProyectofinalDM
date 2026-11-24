import { Router } from "express";
import { HealthController } from "../controllers/HealthController";

export const createHealthRouter = (controller: HealthController): Router => {
  const router = Router();
  router.get("/", controller.handle);
  return router;
};
