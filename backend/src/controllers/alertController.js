import prisma from "../utils/prisma.js";
import {
  getUserById,
  listNearbyHazardAlerts,
  listUserHazardAlerts,
} from "../data/mockStore.js";
import { buildNearbyHazardAlerts } from "../services/workflowService.js";

export async function getNearbyAlerts(req, res, next) {
  try {
    const { latitude, longitude, radiusKm } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    if (prisma && process.env.DATABASE_URL) {
      try {
        const complaints = await prisma.complaint.findMany({
          include: {
            user: true,
            history: true,
          },
        });

        return res.json(
          buildNearbyHazardAlerts(complaints, {
            latitude,
            longitude,
            radiusKm,
          }),
        );
      } catch (dbError) {
        console.warn("Prisma nearby alerts failed, falling back to mock store:", dbError.message);
      }
    }

    return res.json(
      listNearbyHazardAlerts({
        latitude,
        longitude,
        radiusKm,
      }),
    );
  } catch (error) {
    return next(error);
  }
}

export async function getUserAlerts(req, res, next) {
  try {
    const { id } = req.params;

    if (prisma && process.env.DATABASE_URL) {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        const complaints = await prisma.complaint.findMany({
          include: {
            user: true,
            history: true,
          },
        });

        return res.json(
          buildNearbyHazardAlerts(complaints, {
            latitude: user.alertLatitude,
            longitude: user.alertLongitude,
            radiusKm: user.alertRadiusKm || 3,
          }),
        );
      } catch (dbError) {
        console.warn("Prisma user alerts failed, falling back to mock store:", dbError.message);
      }
    }

    const user = getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(listUserHazardAlerts(id));
  } catch (error) {
    return next(error);
  }
}
