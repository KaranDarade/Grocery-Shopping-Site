import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Orders list endpoint" });
});

router.get("/:id", (_req, res) => {
  res.json({ message: "Order detail endpoint" });
});

router.post("/", (_req, res) => {
  res.json({ message: "Create order endpoint" });
});

export default router;
