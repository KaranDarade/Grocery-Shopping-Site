import { Router } from "express";

const router = Router();

router.post("/register", (_req, res) => {
  res.json({ message: "Register endpoint" });
});

router.post("/login", (_req, res) => {
  res.json({ message: "Login endpoint" });
});

router.post("/logout", (_req, res) => {
  res.json({ message: "Logout endpoint" });
});

router.get("/me", (_req, res) => {
  res.json({ message: "Current user endpoint" });
});

router.post("/refresh", (_req, res) => {
  res.json({ message: "Token refresh endpoint" });
});

export default router;
