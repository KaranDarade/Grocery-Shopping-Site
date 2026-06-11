import type { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma.js";
import { AppError } from "../middleware/errorHandler.js";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user!.userId },
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    const formatted = items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        compareAt: item.product.compareAt
          ? Number(item.product.compareAt)
          : null,
      },
    }));

    res.json({ items: formatted });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isAvailable) {
      throw new AppError("Product not found or unavailable", 404);
    }

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.user!.userId,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: req.user!.userId,
        productId,
        quantity,
      },
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    const formatted = {
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        compareAt: item.product.compareAt
          ? Number(item.product.compareAt)
          : null,
      },
    };

    res.status(201).json({ item: formatted });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findUnique({ where: { id } });

    if (!cartItem || cartItem.userId !== req.user!.userId) {
      throw new AppError("Cart item not found", 404);
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id } });
      return res.json({ message: "Item removed" });
    }

    const item = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    const formatted = {
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        compareAt: item.product.compareAt
          ? Number(item.product.compareAt)
          : null,
      },
    };

    res.json({ item: formatted });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const cartItem = await prisma.cartItem.findUnique({ where: { id } });

    if (!cartItem || cartItem.userId !== req.user!.userId) {
      throw new AppError("Cart item not found", 404);
    }

    await prisma.cartItem.delete({ where: { id } });

    res.json({ message: "Item removed" });
  } catch (error) {
    next(error);
  }
};
