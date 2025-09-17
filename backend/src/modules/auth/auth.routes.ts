import { Router } from "express";
import { createAuthController } from "./auth.controller";
import { createAuthMiddleware } from "./auth.middleware";
import { AuthService } from "./auth.service";
import prisma from "../../shared/prisma";

const router = Router();
const authService = new AuthService(prisma);
const controller = createAuthController(authService);
const authMiddleware = createAuthMiddleware(authService);

router.use(controller);
router.get("/me", authMiddleware, (req: any, res) => {
  res.json({ ok: true, user: req.user });
});

// List users (non-sensitive fields only)
router.get("/users", authMiddleware, async (_req, res) => {
  try {
    const users: Array<{ id: string; email: string; name: string; role: string; isactive: boolean }> = await (prisma as any).$queryRaw`
      SELECT u.id, u.email, u.name, u."isActive" as isactive, r.rolename AS role
      FROM "public"."User" u
      JOIN "public"."Role" r ON u."roleId" = r.id
      ORDER BY 
        CASE WHEN u."isActive" = true THEN 0 ELSE 2 END,
        CASE WHEN r.rolename = 'Admin' THEN 0 ELSE 1 END,
        u.name ASC
    `;
    res.json({ ok: true, users });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Failed to fetch users" });
  }
});

export default router;


