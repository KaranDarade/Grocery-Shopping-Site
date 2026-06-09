import { Router } from "express";

const router = Router();

router.post("/create-order", (_req, res) => {
  res.json({ message: "Create Razorpay order endpoint" });
});

router.post("/verify", (_req, res) => {
  res.json({ message: "Verify payment endpoint" });
});

router.post("/webhook", (_req, res) => {
  res.json({ message: "Razorpay webhook endpoint" });
});

export default router;
