import type { Request, Response, NextFunction } from "express";

export const createRazorpayOrder = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.json({
    success: true,
    message: "Payment skipped (demo mode)",
  });
};

export const verifyPayment = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.json({
    success: true,
    message: "Payment verified (demo mode)",
  });
};

export const handleWebhook = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(200).json({ status: "ok" });
};
