import prisma from "../utils/prisma.js";
import {
  addComplaint,
  getComplaintById,
  getRawUsers,
  listComplaints,
} from "../data/mockStore.js";
import { analyzeComplaint } from "../services/aiService.js";

function normalizeComplaintShape(complaint) {
  return {
    ...complaint,
    socialPost: complaint.socialPost || complaint.social_post || "",
  };
}

export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, location, image, latitude, longitude } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required." });
    }

    const analysis = await analyzeComplaint({ title, description, location });

    if (prisma && process.env.DATABASE_URL) {
      const firstUser = await prisma.user.findFirst();

      if (!firstUser) {
        return res.status(400).json({ message: "Create a user before filing a complaint." });
      }

      const complaint = await prisma.complaint.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          userId: firstUser.id,
        },
        include: {
          user: true,
        },
      });

      return res.status(201).json(
        normalizeComplaintShape({
          ...complaint,
          ...analysis,
          image: image || "",
          latitude: latitude || 25.5941,
          longitude: longitude || 85.1376,
          upvotes: 1,
        }),
      );
    }

    const defaultUser = getRawUsers()[0];
    const complaint = addComplaint({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      ...analysis,
      status: "PENDING",
      image: image || "",
      latitude: Number(latitude) || 25.5941,
      longitude: Number(longitude) || 85.1376,
      upvotes: 1,
      userId: defaultUser.id,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json(normalizeComplaintShape(complaint));
  } catch (error) {
    return next(error);
  }
};

export const getComplaints = async (req, res, next) => {
  try {
    if (prisma && process.env.DATABASE_URL) {
      const complaints = await prisma.complaint.findMany({
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json(
        complaints.map((complaint) =>
          normalizeComplaintShape({
            ...complaint,
            category: "General",
            priority: "MEDIUM",
            department: "Civic Response Cell",
            sentiment: "neutral",
            confidence: 0.6,
            suggestedAction: "Validate details before routing.",
            image: "",
            latitude: 25.5941,
            longitude: 85.1376,
            upvotes: 0,
          }),
        ),
      );
    }

    return res.json(listComplaints().map(normalizeComplaintShape));
  } catch (error) {
    return next(error);
  }
};

export const getComplaint = async (req, res, next) => {
  try {
    const complaint = getComplaintById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    return res.json(normalizeComplaintShape(complaint));
  } catch (error) {
    return next(error);
  }
};
