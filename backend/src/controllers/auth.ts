import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { config } from "../config/index.js";
import { AppError } from "../middleware/errorHandler.js";

const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions);
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as SignOptions);
};

const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    setRefreshCookie(res, refreshToken);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("refreshToken", { path: "/api/auth" });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      throw new AppError("No refresh token", 401);
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      throw new AppError("User not found", 401);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    setRefreshCookie(res, refreshToken);

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};


