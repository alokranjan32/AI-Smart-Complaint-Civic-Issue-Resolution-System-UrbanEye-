import prisma from "../utils/prisma.js";
import { getMapHotspots as getMockHotspots } from "../data/mockStore.js";

function normalizeHotspot(complaint) {
  return {
    id: complaint.id,
    title: complaint.title,
    description: complaint.description || "",
    location: complaint.location,
    latitude: Number(complaint.latitude),
    longitude: Number(complaint.longitude),
    category: complaint.category || "General",
    priority: complaint.priority || "MEDIUM",
    status: complaint.status || "PENDING",
    department: complaint.department || "Civic Response Cell",
    createdAt: complaint.createdAt,
  };
}

function hasValidCoordinates(item) {
  return Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude));
}

export async function getMapHotspots() {
  if (prisma && process.env.DATABASE_URL) {
    try {
      const complaints = await prisma.complaint.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          latitude: true,
          longitude: true,
          category: true,
          priority: true,
          status: true,
          department: true,
          createdAt: true,
        },
      });

      return complaints.filter(hasValidCoordinates).map(normalizeHotspot);
    } catch (dbError) {
      console.warn("Prisma map hotspots failed, falling back to mock store:", dbError.message);
    }
  }

  return getMockHotspots().filter(hasValidCoordinates).map(normalizeHotspot);
}
