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
      select: { id: true, username: true, email: true, name: true, roleId: true, role: { select: { rolename: true } } },
    });
    if (!user) return res.status(404).json({ ok: false });
    res.json({ ok: true, user: { id: user.id, username: user.username, email: user.email, name: user.name, roleId: user.roleId, role: user.role?.rolename ?? null } });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// Update my profile (self-service)
router.put("/me", authMiddleware, async (req: any, res) => {
  try {
    const id = req.user?.id as string | undefined;
    if (!id) return res.status(401).json({ ok: false });

    const { username: _ignoreUsername, email, name, password } = req.body as { username?: string; email?: string; name?: string; password?: string };
    const data: any = {};
    if (typeof email === "string") data.email = email;
    if (typeof name === "string") data.name = name;
    if (typeof password === "string" && password.trim().length > 0) {
      const bcrypt = (await import("bcrypt")).default;
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, email: true, name: true, roleId: true, role: { select: { rolename: true } } },
    });
    res.json({ ok: true, user: { id: user.id, username: user.username, email: user.email, name: user.name, roleId: user.roleId, role: user.role?.rolename ?? null } });
  } catch (error: any) {
    res.status(400).json({ ok: false, message: error?.message || "Failed to update profile" });
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

// Admin-only: create user
router.post("/users", authMiddleware, async (req: any, res) => {
  try {
    const requesterId = req.user?.id as string | undefined;
    if (!requesterId) return res.status(401).json({ ok: false });
    const me = await prisma.user.findUnique({ where: { id: requesterId }, select: { roleId: true } });
    if (!me || me.roleId !== "1") return res.status(403).json({ ok: false, message: "Forbidden" });

    const { username, email, name, password, roleId = "2", isActive = true } = req.body as { username: string; email: string; name: string; password: string; roleId?: string; isActive?: boolean };
    if (!username || !email || !name || !password) return res.status(400).json({ ok: false, message: "Missing required fields" });

    const bcrypt = (await import("bcrypt")).default;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, name, password: hashedPassword, roleId, isActive },
      select: { id: true, username: true, email: true, name: true, roleId: true, role: { select: { rolename: true } }, isActive: true },
    });
    res.json({ ok: true, user: { ...user, role: user.role?.rolename ?? null, isactive: user.isActive } });
  } catch (error: any) {
    res.status(400).json({ ok: false, message: error?.message || "Failed to create user" });
  }
});

// Admin-only: update user
router.put("/users/:id", authMiddleware, async (req: any, res) => {
  try {
    const requesterId = req.user?.id as string | undefined;
    if (!requesterId) return res.status(401).json({ ok: false });
    const me = await prisma.user.findUnique({ where: { id: requesterId }, select: { roleId: true } });
    if (!me || me.roleId !== "1") return res.status(403).json({ ok: false, message: "Forbidden" });

    const userId = req.params.id as string;
  const { username: _ignoredUsername, email, name, password, roleId, isActive } = req.body as { username?: string; email?: string; name?: string; password?: string; roleId?: string; isActive?: boolean };

    const data: any = {};
    // Username is immutable via admin edit
    if (typeof email === "string") data.email = email;
    if (typeof name === "string") data.name = name;
    if (typeof roleId === "string") data.roleId = roleId;
    if (typeof isActive === "boolean") data.isActive = isActive;
    if (typeof password === "string" && password.trim().length > 0) {
      const bcrypt = (await import("bcrypt")).default;
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, username: true, email: true, name: true, roleId: true, role: { select: { rolename: true } }, isActive: true },
    });
    res.json({ ok: true, user: { ...user, role: user.role?.rolename ?? null, isactive: user.isActive } });
  } catch (error: any) {
    res.status(400).json({ ok: false, message: error?.message || "Failed to update user" });
  }
});

export default router;


