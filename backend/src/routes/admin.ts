import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getUsers, getUserById } from "../controllers/admin.js";

const router = Router();

router.use(requireAdmin);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);

export default router;
