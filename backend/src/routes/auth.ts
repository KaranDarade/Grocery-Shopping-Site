import { Router } from "express";
import { register, login, logout, getMe, refresh } from "../controllers/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);
router.post("/refresh", refresh);

export default router;
