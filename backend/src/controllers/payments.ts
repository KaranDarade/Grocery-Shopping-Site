import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import prisma from "../utils/prisma.js";
import { config } from "../config/index.js";
import { AppError } from "../middleware/errorHandler.js";

let razorpayInstance: Razorpay | null = null;
function getRazorpay() {
  if (!razorpayInstance) {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      throw new AppError("Razorpay not configured", 500);
    }
    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return razorpayInstance;
}

export const createRazorpayOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || order.userId !== req.user!.userId) {
      throw new AppError("Order not found", 404);
    }

    if (order.razorpayOrderId) {
      throw new AppError("Payment already initiated for this order", 400);
    }

    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(Number(order.total) * 100),
      currency: "INR",
      receipt: orderId,
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: config.razorpay.keyId,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.keySecret)
      .update(body)
      .digest("hex");

    const signatureIsValid =
      expectedSignature.length === razorpaySignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpaySignature)
      );

    if (!signatureIsValid) {
      throw new AppError("Invalid payment signature", 400);
    }

    const order = await prisma.order.findFirst({
      where: { razorpayOrderId },
    });

    if (!order) {
      throw new AppError("Order not found for this payment", 404);
    }

    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
        },
      }),
      prisma.payment.create({
        data: {
          orderId: order.id,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: "PAID",
          amount: order.total,
        },
      }),
    ]);

    res.json({
      message: "Payment verified",
      order: {
        id: updatedOrder.id,
        total: Number(updatedOrder.total),
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Webhook verification requires RAZORPAY_WEBHOOK_SECRET in environment.
    // This route needs express.raw({ type: "*/*" }) middleware at the app level
    // or route level to preserve the raw body for signature verification.
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
      const signature = req.headers["x-razorpay-signature"] as string;
      if (!signature) {
        throw new AppError("Missing webhook signature", 400);
      }

      const rawBody = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const signatureIsValid =
        expectedSignature.length === signature.length &&
        crypto.timingSafeEqual(
          Buffer.from(expectedSignature),
          Buffer.from(signature)
        );

      if (!signatureIsValid) {
        throw new AppError("Invalid webhook signature", 400);
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured") {
      const razorpayOrderId = payload.payment.entity.order_id;
      const razorpayPaymentId = payload.payment.entity.id;

      const order = await prisma.order.findFirst({
        where: { razorpayOrderId },
      });

      if (order) {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: "PAID", status: "CONFIRMED" },
          }),
          prisma.payment.upsert({
            where: { orderId: order.id },
            update: {
              razorpayPaymentId,
              status: "PAID",
            },
            create: {
              orderId: order.id,
              razorpayOrderId,
              razorpayPaymentId,
              status: "PAID",
              amount: order.total,
            },
          }),
        ]);
      }
    } else if (event === "payment.failed") {
      const razorpayOrderId = payload.payment.entity.order_id;

      const order = await prisma.order.findFirst({
        where: { razorpayOrderId },
      });

      if (order) {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: "FAILED" },
          }),
          prisma.payment.upsert({
            where: { orderId: order.id },
            update: { status: "FAILED" },
            create: {
              orderId: order.id,
              razorpayOrderId,
              status: "FAILED",
              amount: order.total,
            },
          }),
        ]);
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};
