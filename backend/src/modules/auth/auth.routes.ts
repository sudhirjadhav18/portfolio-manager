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
router.get("/me", authMiddleware, async (req: any, res) => {
  try {
    const id = req.user?.id as string | undefined;
    if (!id) return res.status(401).json({ ok: false });
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, name: true },
    });
    if (!user) return res.status(404).json({ ok: false });
    res.json({ ok: true, user });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// List users (non-sensitive fields only)
router.get("/users", authMiddleware, async (_req, res) => {
  try {
    const users: Array<{ id: string; username: string; email: string | null; name: string; role: string; isactive: boolean }> = await (prisma as any).$queryRaw`
      SELECT u.id, u.username, u.email, u.name, u."isActive" as isactive, r.rolename AS role
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


