import type { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma.js";

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
};
