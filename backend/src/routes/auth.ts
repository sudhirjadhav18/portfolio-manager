import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Hardcoded user
const USER = { id: "u1", email: "you@example.com", name: "You", password: "password123" };

// POST /api/auth/login
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === USER.email && password === USER.password) {
    const token = jwt.sign({ id: USER.id, email: USER.email, name: USER.name }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, message: "Invalid credentials" });
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
