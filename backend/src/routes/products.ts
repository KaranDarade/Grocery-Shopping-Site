import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Products list endpoint" });
});

router.get("/:slug", (_req, res) => {
  res.json({ message: "Product detail endpoint" });
});

export default router;
