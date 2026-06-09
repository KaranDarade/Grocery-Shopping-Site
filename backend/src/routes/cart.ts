import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Cart endpoint" });
});

router.post("/", (_req, res) => {
  res.json({ message: "Add to cart endpoint" });
});

router.patch("/:id", (_req, res) => {
  res.json({ message: "Update cart item endpoint" });
});

router.delete("/:id", (_req, res) => {
  res.json({ message: "Remove cart item endpoint" });
});

export default router;
