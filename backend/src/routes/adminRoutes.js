import { Router } from "express";
import {
  getAdminComplaint,
  getAdminComplaintHistory,
  getAdminComplaints,
  getAdminOverview,
  getAdminUsers,
  updateAdminComplaint,
} from "../controllers/adminController.js";

const router = Router();

router.get("/overview", getAdminOverview);
router.get("/complaints", getAdminComplaints);
router.get("/complaints/:id", getAdminComplaint);
router.get("/complaints/:id/history", getAdminComplaintHistory);
router.patch("/complaints/:id", updateAdminComplaint);
router.get("/users", getAdminUsers);

export default router;
