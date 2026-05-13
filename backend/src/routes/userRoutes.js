import { Router } from "express";
import { getCurrentUser, updateCurrentUser } from "../controllers/userController.js";

const router = Router();

router.get("/me", getCurrentUser);
router.patch("/:id", updateCurrentUser);

export default router;
