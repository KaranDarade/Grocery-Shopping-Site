import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Categories list endpoint" });
});

export default router;
