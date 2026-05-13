import API from "./api";

function normalizeHotspot(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description || item.location || "",
    location: item.location,
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    category: item.category || "General",
    priority: item.priority || "MEDIUM",
    status: item.status || "PENDING",
    department: item.department || "Civic Response Cell",
  };
}

export async function getHotspots() {
  try {
    const response = await API.get("/map/hotspots");
    return Array.isArray(response.data) ? response.data.map(normalizeHotspot) : [];
  } catch (error) {
    return [];
  }
}
