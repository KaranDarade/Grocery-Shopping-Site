import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
} from "../controllers/payments.js";

const router = Router();

router.post("/create-order", requireAuth, createRazorpayOrder);
router.post("/verify", requireAuth, verifyPayment);
router.post("/webhook", handleWebhook);

export default router;
