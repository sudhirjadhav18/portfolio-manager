import { Request, Response, Router } from "express";
import { AuthService } from "./auth.service";

export const createAuthController = (authService: AuthService) => {
  const router = Router();

  router.post("/register", async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    try {
      const user = await authService.registerUser(email, name, password);
      res.json({ ok: true, user });
    } catch (err) {
      res.status(400).json({ ok: false, message: "User already exists" });
    }
  });

  router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);
    if (!user) return res.status(401).json({ ok: false, message: "Invalid credentials" });
    const token = authService.createToken({ id: user.id, email: user.email });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json({ ok: true });
  });

  router.post("/logout", async (_req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ ok: true });
  });

  return router;
};


