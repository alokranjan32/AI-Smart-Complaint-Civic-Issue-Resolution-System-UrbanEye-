import { getMapHotspots } from "../data/mockStore.js";

export function getMapHotspotsController(req, res) {
  res.json(getMapHotspots());
}
