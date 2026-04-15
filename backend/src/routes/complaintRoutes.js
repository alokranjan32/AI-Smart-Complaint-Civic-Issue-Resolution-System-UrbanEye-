
import express from "express";
import {
  createComplaint,
  getComplaint,
  getComplaints,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getComplaints);
router.get("/:id", getComplaint);

export default router;
