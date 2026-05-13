
import express from "express";
import {
  createComplaint,
  getComplaint,
  getComplaintHistory,
  getComplaints,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getComplaints);
router.get("/:id/history", getComplaintHistory);
router.get("/:id", getComplaint);

export default router;
