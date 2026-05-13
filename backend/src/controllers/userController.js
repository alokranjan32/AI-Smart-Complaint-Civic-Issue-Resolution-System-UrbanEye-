import prisma from "../utils/prisma.js";
import { getUserById, listUsers, updateUserPreferences } from "../data/mockStore.js";

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export function getCurrentUser(req, res) {
  const selectedUserId = req.query.userId;

  if (prisma && process.env.DATABASE_URL) {
    const loadUser = async () => {
      try {
        const user = selectedUserId
          ? await prisma.user.findUnique({ where: { id: selectedUserId } })
          : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });

        return res.json(sanitizeUser(user));
      } catch (dbError) {
        console.warn("Prisma current user read failed, falling back to mock store:", dbError.message);

        if (selectedUserId) {
          return res.json(sanitizeUser(getUserById(selectedUserId)));
        }

        return res.json(listUsers()[0] || null);
      }
    };

    return loadUser();
  }

  if (selectedUserId) {
    return res.json(sanitizeUser(getUserById(selectedUserId)));
  }

  return res.json(listUsers()[0] || null);
}

export async function updateCurrentUser(req, res, next) {
  try {
    const targetUserId = req.params.id || req.body.userId;

    if (!targetUserId) {
      return res.status(400).json({ message: "User id is required." });
    }

    const payload = {
      xHandle: req.body.xHandle,
      alertsEnabled: req.body.alertsEnabled,
      alertLatitude:
        req.body.alertLatitude !== undefined ? Number(req.body.alertLatitude) : undefined,
      alertLongitude:
        req.body.alertLongitude !== undefined ? Number(req.body.alertLongitude) : undefined,
      alertRadiusKm:
        req.body.alertRadiusKm !== undefined ? Number(req.body.alertRadiusKm) : undefined,
    };

    if (prisma && process.env.DATABASE_URL) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: targetUserId },
        });

        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        const updatedUser = await prisma.user.update({
          where: { id: targetUserId },
          data: {
            xHandle: payload.xHandle !== undefined ? payload.xHandle : user.xHandle,
            alertsEnabled:
              payload.alertsEnabled !== undefined ? payload.alertsEnabled : user.alertsEnabled,
            alertLatitude:
              payload.alertLatitude !== undefined ? payload.alertLatitude : user.alertLatitude,
            alertLongitude:
              payload.alertLongitude !== undefined ? payload.alertLongitude : user.alertLongitude,
            alertRadiusKm:
              payload.alertRadiusKm !== undefined ? payload.alertRadiusKm : user.alertRadiusKm,
          },
        });

        return res.json(sanitizeUser(updatedUser));
      } catch (dbError) {
        console.warn("Prisma user update failed, falling back to mock store:", dbError.message);
      }
    }

    const updatedUser = updateUserPreferences(targetUserId, payload);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(sanitizeUser(updatedUser));
  } catch (error) {
    return next(error);
  }
}
