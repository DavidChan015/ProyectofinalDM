import { Router } from "express";
import { FaceController } from "../controllers/FaceController";

export const createFaceRouter = (controller: FaceController): Router => {
  const router = Router();
  router.post("/register", controller.register);
  router.post("/verify", controller.verify);
  return router;
};
