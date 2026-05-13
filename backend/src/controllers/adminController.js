import prisma from "../utils/prisma.js";
import {
  getAnalytics,
  getComplaintById,
  listComplaintHistory,
  listComplaints,
  listUsers,
  updateComplaintWorkflow,
} from "../data/mockStore.js";
import { deleteCacheKeys } from "../services/cacheService.js";
import {
  buildOverviewFromComplaints,
  buildWorkflowHistoryEntries,
  normalizeComplaintShape,
  WORKFLOW_STATUS_VALUES,
} from "../services/workflowService.js";

const COMPLAINTS_CACHE_KEY = "complaints:all";

function complaintCacheKey(id) {
  return `complaints:${id}`;
}

export async function getAdminOverview(req, res, next) {
  try {
    if (prisma && process.env.DATABASE_URL) {
      try {
        const [complaints, usersCount] = await Promise.all([
          prisma.complaint.findMany({
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
          }),
          prisma.user.count(),
        ]);

        return res.json(buildOverviewFromComplaints(complaints, usersCount));
      } catch (dbError) {
        console.warn("Prisma admin overview failed, falling back to mock store:", dbError.message);
      }
    }

    return res.json(getAnalytics());
  } catch (error) {
    return next(error);
  }
}

export async function getAdminComplaints(req, res, next) {
  try {
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

        return res.json(complaints.map(normalizeComplaintShape));
      } catch (dbError) {
        console.warn("Prisma admin complaints failed, falling back to mock store:", dbError.message);
      }
    }

    return res.json(listComplaints().map(normalizeComplaintShape));
  } catch (error) {
    return next(error);
  }
}

export async function getAdminUsers(req, res, next) {
  try {
    if (prisma && process.env.DATABASE_URL) {
      try {
        const users = await prisma.user.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });

        return res.json(
          users.map(({ password, ...user }) => user),
        );
      } catch (dbError) {
        console.warn("Prisma admin users failed, falling back to mock store:", dbError.message);
      }
    }

    return res.json(listUsers());
  } catch (error) {
    return next(error);
  }
}

export async function getAdminComplaint(req, res, next) {
  try {
    if (prisma && process.env.DATABASE_URL) {
      try {
        const complaint = await prisma.complaint.findUnique({
          where: { id: req.params.id },
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

        return res.json(normalizeComplaintShape(complaint));
      } catch (dbError) {
        console.warn("Prisma admin complaint detail failed, falling back to mock store:", dbError.message);
      }
    }

    const complaint = getComplaintById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    return res.json(normalizeComplaintShape(complaint));
  } catch (error) {
    return next(error);
  }
}

export async function getAdminComplaintHistory(req, res, next) {
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
        console.warn("Prisma admin complaint history failed, falling back to mock store:", dbError.message);
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
}

export async function updateAdminComplaint(req, res, next) {
  try {
    const { status, department, assignedTo, note } = req.body;

    if (!status && !department && assignedTo === undefined && note === undefined) {
      return res.status(400).json({ message: "Provide at least one workflow field to update." });
    }

    if (prisma && process.env.DATABASE_URL) {
      try {
        const existingComplaint = await prisma.complaint.findUnique({
          where: { id: req.params.id },
          include: { user: true },
        });

        if (!existingComplaint) {
          return res.status(404).json({ message: "Complaint not found." });
        }

        const nextStatus = status || existingComplaint.status;
        if (!WORKFLOW_STATUS_VALUES.includes(nextStatus)) {
          return res.status(400).json({ message: "Unsupported status value." });
        }

        const workflowUpdate = buildWorkflowHistoryEntries(existingComplaint, {
          status,
          department,
          assignedTo,
          note,
          actorName: "Sonal Verma",
          actorRole: "ADMIN",
        });

        await prisma.$transaction(async (transaction) => {
          await transaction.complaint.update({
            where: { id: req.params.id },
            data: {
              status: workflowUpdate.nextStatus,
              department: workflowUpdate.nextDepartment,
              assignedTo: workflowUpdate.nextAssignedTo,
              adminNote: workflowUpdate.nextNote,
              updatedAt: new Date(workflowUpdate.timestamp),
            },
          });

          if (workflowUpdate.entries.length) {
            await transaction.complaintHistory.createMany({
              data: workflowUpdate.entries.map((entry) => ({
                complaintId: entry.complaintId,
                type: entry.type,
                actorName: entry.actorName,
                actorRole: entry.actorRole,
                message: entry.message,
                fromStatus: entry.fromStatus,
                toStatus: entry.toStatus,
                department: entry.department,
                assignedTo: entry.assignedTo,
                note: entry.note,
                createdAt: new Date(entry.createdAt),
              })),
            });
          }
        });

        const updatedComplaint = await prisma.complaint.findUnique({
          where: { id: req.params.id },
          include: {
            user: true,
            history: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        await deleteCacheKeys([COMPLAINTS_CACHE_KEY, complaintCacheKey(req.params.id)]);

        return res.json(normalizeComplaintShape(updatedComplaint));
      } catch (dbError) {
        console.warn("Prisma admin workflow update failed, falling back to mock store:", dbError.message);
      }
    }

    if (status && !WORKFLOW_STATUS_VALUES.includes(status)) {
      return res.status(400).json({ message: "Unsupported status value." });
    }

    const updatedComplaint = updateComplaintWorkflow(req.params.id, {
      status,
      department,
      assignedTo,
      note,
      actorName: "Sonal Verma",
      actorRole: "ADMIN",
    });

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    await deleteCacheKeys([COMPLAINTS_CACHE_KEY, complaintCacheKey(req.params.id)]);

    return res.json(normalizeComplaintShape(updatedComplaint));
  } catch (error) {
    return next(error);
  }
}
