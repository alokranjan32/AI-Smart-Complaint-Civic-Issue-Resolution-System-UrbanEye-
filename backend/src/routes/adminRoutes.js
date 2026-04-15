import { Router } from "express";
import {
  getAdminComplaints,
  getAdminOverview,
  getAdminUsers,
} from "../controllers/adminController.js";

const router = Router();

router.get("/overview", getAdminOverview);
router.get("/complaints", getAdminComplaints);
router.get("/users", getAdminUsers);

export default router;
