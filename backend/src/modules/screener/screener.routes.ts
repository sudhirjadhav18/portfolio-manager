import { Router } from "express";
import { ScreenerController } from "./screener.controller";
import { createAuthMiddleware } from "../auth/auth.middleware";
import { AuthService } from "../auth/auth.service";
import prisma from "../../shared/prisma";

const router = Router();
const authService = new AuthService(prisma);
const authMiddleware = createAuthMiddleware(authService);


router.get("/", authMiddleware, ScreenerController.list);
router.post("/seed", authMiddleware, ScreenerController.seed);
router.patch("/:id/toggle", authMiddleware, ScreenerController.toggle);
router.post("/upload-stocks", authMiddleware, ScreenerController.uploadStocks);

export default router;


