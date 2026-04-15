import { Router } from "express";
import { getMapHotspotsController } from "../controllers/mapController.js";

const router = Router();

router.get("/hotspots", getMapHotspotsController);

export default router;
