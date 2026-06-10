import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { config } from "../config/index.js";
import { AppError } from "./errorHandler.js";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = header.split(" ")[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        userId: string;
        role: string;
      };
      req.user = { userId: decoded.userId, role: decoded.role };
      next();
    } catch {
      throw new AppError("Invalid or expired token", 401);
    }
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  requireAuth(req, res, () => {
    if (req.user?.role !== "ADMIN") {
      return next(new AppError("Admin access required", 403));
    }
    next();
  });
};

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return _res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};
