import { Router } from "express";

import { getNearbyAlerts, getUserAlerts } from "../controllers/alertController.js";

const router = Router();

router.get("/nearby", getNearbyAlerts);
router.get("/user/:id", getUserAlerts);

export default router;
