import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export interface AuthRequest extends Request { user?: any }

export const createAuthMiddleware = (authService: AuthService) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = (req as any).cookies?.token;
    if (!token) return res.status(401).json({ ok: false });
    try {
      const payload = authService.verifyToken(token);
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ ok: false });
    }
  };
};


