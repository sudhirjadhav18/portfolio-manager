import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router, Request, Response } from "express";

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, name, password: hashed },
    });
    res.json({ ok: true, user });
  } catch (err) {
    res.status(400).json({ ok: false, message: "User already exists" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ ok: false, message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ ok: false, message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.json({ ok: true });
});

// Middleware to verify token
interface AuthRequest extends Request { user?: any }
const authMiddleware = (req: AuthRequest, res: Response, next: Function) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ ok: false });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false });
  }
};

// GET /api/auth/me
router.get("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ ok: true, user: req.user });
});

// POST /api/auth/logout
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

export default router;
