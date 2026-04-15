import { apiRequest } from "../lib/api";
import { demoComplaints } from "../lib/demoData";

export async function getHotspots() {
  return apiRequest("/map/hotspots", {
    fallbackData: demoComplaints.map((item) => ({
      id: item.id,
      title: item.title,
      location: item.location,
      latitude: item.latitude,
      longitude: item.longitude,
      category: item.category,
      priority: item.priority,
      status: item.status,
    })),
  });
}
