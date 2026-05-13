import { getMapHotspots } from "../services/mapService.js";

export async function getMapHotspotsController(req, res, next) {
  try {
    const hotspots = await getMapHotspots();
    res.json(hotspots);
  } catch (error) {
    next(error);
  }
}
