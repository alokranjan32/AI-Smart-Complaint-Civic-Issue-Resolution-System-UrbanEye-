import prisma from "../utils/prisma.js";
import {
  addComplaint,
  getComplaintById,
  getRawUsers,
  listComplaints,
  listComplaintHistory,
} from "../data/mockStore.js";
import { analyzeComplaint } from "../services/aiService.js";
import {
  deleteCacheKeys,
  getCachedJson,
  setCachedJson,
} from "../services/cacheService.js";
import { normalizeComplaintShape } from "../services/workflowService.js";

const COMPLAINTS_CACHE_KEY = "complaints:all";
const COMPLAINT_CACHE_TTL_SECONDS = Number(process.env.COMPLAINT_CACHE_TTL_SECONDS) || 60;

function complaintCacheKey(id) {
  return `complaints:${id}`;
}

export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, location, image, latitude, longitude } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required." });
    }

    const analysis = await analyzeComplaint({ title, description, location });

    if (prisma && process.env.DATABASE_URL) {
      try {
        const firstUser = await prisma.user.findFirst();

        if (!firstUser) {
          return res.status(400).json({ message: "Create a user before filing a complaint." });
        }

        const complaint = await prisma.complaint.create({
          data: {
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            category: analysis.category,
            priority: analysis.priority,
            department: analysis.department,
            sentiment: analysis.sentiment,
            confidence: analysis.confidence,
            suggestedAction: analysis.suggestedAction,
            socialPost: analysis.socialPost,
            image: image || "",
            latitude: Number(latitude) || 25.5941,
            longitude: Number(longitude) || 85.1376,
            upvotes: 1,
            userId: firstUser.id,
            history: {
              create: {
                type: "CREATED",
                actorName: firstUser.name,
                actorRole: firstUser.role,
                message: "Complaint submitted and routed for AI triage.",
                toStatus: "PENDING",
                department: analysis.department,
                note: analysis.suggestedAction,
              },
            },
          },
          include: {
            user: true,
            history: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        await deleteCacheKeys([COMPLAINTS_CACHE_KEY]);

        return res.status(201).json(
          normalizeComplaintShape(complaint),
        );
      } catch (dbError) {
        console.warn("Prisma complaint create failed, falling back to mock store:", dbError.message);
      }
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
      assignedTo: "",
      adminNote: "",
      userId: defaultUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await deleteCacheKeys([COMPLAINTS_CACHE_KEY]);

    return res.status(201).json(normalizeComplaintShape(complaint));
  } catch (error) {
    return next(error);
  }
};

export const getComplaints = async (req, res, next) => {
  try {
    const cachedComplaints = await getCachedJson(COMPLAINTS_CACHE_KEY);
    if (cachedComplaints) {
      return res.json(cachedComplaints);
    }

    if (prisma && process.env.DATABASE_URL) {
      try {
        const complaints = await prisma.complaint.findMany({
          include: {
            user: true,
            history: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const normalizedComplaints = complaints.map(normalizeComplaintShape);
        await setCachedJson(
          COMPLAINTS_CACHE_KEY,
          normalizedComplaints,
          COMPLAINT_CACHE_TTL_SECONDS,
        );

        return res.json(normalizedComplaints);
      } catch (dbError) {
        console.warn("Prisma complaints read failed, falling back to mock store:", dbError.message);
      }
    }

    const complaints = listComplaints().map(normalizeComplaintShape);
    await setCachedJson(COMPLAINTS_CACHE_KEY, complaints, COMPLAINT_CACHE_TTL_SECONDS);

    return res.json(complaints);
  } catch (error) {
    return next(error);
  }
};

export const getComplaint = async (req, res, next) => {
  try {
    const cacheKey = complaintCacheKey(req.params.id);
    const cachedComplaint = await getCachedJson(cacheKey);
    if (cachedComplaint) {
      return res.json(cachedComplaint);
    }

    if (prisma && process.env.DATABASE_URL) {
      try {
        const complaint = await prisma.complaint.findUnique({
          where: {
            id: req.params.id,
          },
          include: {
            user: true,
            history: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        if (!complaint) {
          return res.status(404).json({ message: "Complaint not found." });
        }

        const normalizedComplaint = normalizeComplaintShape(complaint);
        await setCachedJson(cacheKey, normalizedComplaint, COMPLAINT_CACHE_TTL_SECONDS);

        return res.json(normalizedComplaint);
      } catch (dbError) {
        console.warn("Prisma complaint detail failed, falling back to mock store:", dbError.message);
      }
    }

    const complaint = getComplaintById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    const normalizedComplaint = normalizeComplaintShape(complaint);
    await setCachedJson(cacheKey, normalizedComplaint, COMPLAINT_CACHE_TTL_SECONDS);

    return res.json(normalizedComplaint);
  } catch (error) {
    return next(error);
  }
};

export const getComplaintHistory = async (req, res, next) => {
  try {
    if (prisma && process.env.DATABASE_URL) {
      try {
        const complaint = await prisma.complaint.findUnique({
          where: { id: req.params.id },
        });

        if (!complaint) {
          return res.status(404).json({ message: "Complaint not found." });
        }

        const history = await prisma.complaintHistory.findMany({
          where: {
            complaintId: req.params.id,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return res.json(history);
      } catch (dbError) {
        console.warn("Prisma complaint history failed, falling back to mock store:", dbError.message);
      }
    }

    const complaint = getComplaintById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    return res.json(listComplaintHistory(req.params.id));
  } catch (error) {
    return next(error);
  }
};
