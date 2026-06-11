import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createOrder,
  getOrders,
  getOrderById,
} from "../controllers/orders.js";

const router = Router();

router.use(requireAuth);

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById);

export default router;
