import type { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma.js";
import { AppError } from "../middleware/errorHandler.js";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shippingAddress } = req.body;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user!.userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        throw new AppError(
          `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`,
          400
        );
      }
    }

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId: req.user!.userId,
          total,
          shippingAddress: shippingAddress || "Demo Address, City",
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      }),
      prisma.cartItem.deleteMany({ where: { userId: req.user!.userId } }),
    ]);

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit as string) || 10)
    );
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: { select: { items: true } },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    res.json({
      orders: orders.map((order) => ({
        id: order.id,
        total: Number(order.total),
        status: order.status,
        paymentStatus: order.paymentStatus,
        itemCount: order._count.items,
        createdAt: order.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
    });

    if (!order || order.userId !== req.user!.userId) {
      throw new AppError("Order not found", 404);
    }

    res.json({
      order: {
        ...order,
        total: Number(order.total),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          product: {
            ...item.product,
            price: Number(item.product.price),
            compareAt: item.product.compareAt
              ? Number(item.product.compareAt)
              : null,
          },
        })),
        payment: order.payment
          ? {
              ...order.payment,
              amount: Number(order.payment.amount),
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};
