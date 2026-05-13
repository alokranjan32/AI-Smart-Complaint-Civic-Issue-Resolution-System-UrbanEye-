export const WORKFLOW_STATUS_VALUES = ["PENDING", "IN_PROGRESS", "RESOLVED"];

function normalizeHistoryEntry(entry) {
  return {
    ...entry,
    actorRole: String(entry.actorRole || "ADMIN"),
    fromStatus: entry.fromStatus || null,
    toStatus: entry.toStatus || null,
    department: entry.department || "",
    assignedTo: entry.assignedTo || "",
    note: entry.note || "",
  };
}

export function createDefaultHistoryEntry(complaint) {
  return {
    id: `history-${complaint.id}-created`,
    complaintId: complaint.id,
    type: "CREATED",
    actorName: complaint.user?.name || "Citizen",
    actorRole: String(complaint.user?.role || "CITIZEN"),
    message: "Complaint submitted and routed for AI triage.",
    fromStatus: null,
    toStatus: complaint.status || "PENDING",
    department: complaint.department || "Civic Response Cell",
    assignedTo: complaint.assignedTo || "",
    note: complaint.adminNote || complaint.suggestedAction || "",
    createdAt: complaint.createdAt,
  };
}

export function normalizeComplaintShape(complaint) {
  const historySource = complaint.history || complaint.complaintHistory || [];
  const history = historySource.length
    ? historySource.map(normalizeHistoryEntry)
    : [createDefaultHistoryEntry(complaint)];

  return {
    ...complaint,
    category: complaint.category || "General",
    priority: complaint.priority || "MEDIUM",
    department: complaint.department || "Civic Response Cell",
    sentiment: complaint.sentiment || "concerned",
    confidence: complaint.confidence ?? 0.72,
    suggestedAction: complaint.suggestedAction || complaint.suggested_action || "",
    socialPost: complaint.socialPost || complaint.social_post || "",
    image: complaint.image || "",
    latitude: Number(complaint.latitude) || 25.5941,
    longitude: Number(complaint.longitude) || 85.1376,
    upvotes: Number(complaint.upvotes) || 0,
    assignedTo: complaint.assignedTo || "",
    adminNote: complaint.adminNote || "",
    updatedAt: complaint.updatedAt || complaint.createdAt,
    history,
  };
}

export function buildWorkflowHistoryEntries(existingComplaint, updates) {
  const actorName = updates.actorName || "Admin";
  const actorRole = String(updates.actorRole || "ADMIN");
  const timestamp = updates.timestamp || new Date().toISOString();
  const nextStatus = updates.status || existingComplaint.status;
  const nextDepartment = updates.department || existingComplaint.department;
  const nextAssignedTo = updates.assignedTo ?? existingComplaint.assignedTo ?? "";
  const nextNote = updates.note ?? existingComplaint.adminNote ?? "";
  const entries = [];

  if (
    nextDepartment !== existingComplaint.department ||
    nextAssignedTo !== (existingComplaint.assignedTo || "")
  ) {
    entries.push({
      complaintId: existingComplaint.id,
      type: "ASSIGNED",
      actorName,
      actorRole,
      message: nextAssignedTo
        ? `Complaint assigned to ${nextAssignedTo}.`
        : `Complaint rerouted to ${nextDepartment}.`,
      fromStatus: existingComplaint.status,
      toStatus: nextStatus,
      department: nextDepartment,
      assignedTo: nextAssignedTo,
      note: nextNote,
      createdAt: timestamp,
    });
  }

  if (nextStatus !== existingComplaint.status) {
    entries.push({
      complaintId: existingComplaint.id,
      type: nextStatus === "RESOLVED" ? "RESOLVED" : "STATUS_UPDATED",
      actorName,
      actorRole,
      message: `Complaint status changed from ${String(existingComplaint.status).replace("_", " ")} to ${String(nextStatus).replace("_", " ")}.`,
      fromStatus: existingComplaint.status,
      toStatus: nextStatus,
      department: nextDepartment,
      assignedTo: nextAssignedTo,
      note: nextNote,
      createdAt: timestamp,
    });
  }

  if (updates.note && updates.note !== existingComplaint.adminNote) {
    entries.push({
      complaintId: existingComplaint.id,
      type: "NOTE",
      actorName,
      actorRole,
      message: "Admin note added for complaint tracking.",
      fromStatus: nextStatus,
      toStatus: nextStatus,
      department: nextDepartment,
      assignedTo: nextAssignedTo,
      note: updates.note,
      createdAt: timestamp,
    });
  }

  return {
    entries,
    nextStatus,
    nextDepartment,
    nextAssignedTo,
    nextNote,
    timestamp,
  };
}

export function buildOverviewFromComplaints(complaints, usersCount = 0) {
  const items = complaints.map(normalizeComplaintShape);
  const statusBreakdown = items.reduce((accumulator, item) => {
    accumulator[item.status] = (accumulator[item.status] || 0) + 1;
    return accumulator;
  }, {});
  const priorityBreakdown = items.reduce((accumulator, item) => {
    accumulator[item.priority] = (accumulator[item.priority] || 0) + 1;
    return accumulator;
  }, {});
  const departmentBreakdown = items.reduce((accumulator, item) => {
    accumulator[item.department] = (accumulator[item.department] || 0) + 1;
    return accumulator;
  }, {});

  return {
    totals: {
      complaints: items.length,
      pending: statusBreakdown.PENDING || 0,
      inProgress: statusBreakdown.IN_PROGRESS || 0,
      resolved: statusBreakdown.RESOLVED || 0,
      users: usersCount,
    },
    statusBreakdown,
    priorityBreakdown,
    departmentBreakdown,
    recentComplaints: items.slice(0, 5),
  };
}

function isHazardComplaint(complaint) {
  if (complaint.status === "RESOLVED") {
    return false;
  }

  const text = `${complaint.title} ${complaint.description}`.toLowerCase();
  const category = (complaint.category || "").toLowerCase();

  return (
    ["roads", "water", "electricity"].includes(category) ||
    /(pothole|open drain|water leakage|flood|streetlight|broken road|accident)/.test(text)
  );
}

function hazardSeverity(complaint) {
  if (complaint.priority === "CRITICAL") {
    return "CRITICAL";
  }

  const text = `${complaint.title} ${complaint.description}`.toLowerCase();
  if (/(pothole|accident|open drain)/.test(text)) {
    return "HIGH";
  }

  return complaint.priority === "HIGH" ? "HIGH" : "MEDIUM";
}

function hazardRadiusKm(complaint) {
  const severity = hazardSeverity(complaint);

  if (severity === "CRITICAL") {
    return 5;
  }

  if (severity === "HIGH") {
    return 3;
  }

  return 1.5;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceKm(fromLatitude, fromLongitude, toLatitude, toLongitude) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(toLatitude - fromLatitude);
  const longitudeDelta = toRadians(toLongitude - fromLongitude);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(fromLatitude)) *
      Math.cos(toRadians(toLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function buildHazardAlert(complaint, distance) {
  return {
    id: `alert-${complaint.id}`,
    complaintId: complaint.id,
    title: complaint.title,
    message: `${complaint.category} hazard reported near ${complaint.location}.`,
    category: complaint.category,
    severity: hazardSeverity(complaint),
    distanceKm: Number(distance.toFixed(2)),
    hazardRadiusKm: hazardRadiusKm(complaint),
    latitude: Number(complaint.latitude),
    longitude: Number(complaint.longitude),
    location: complaint.location,
    status: complaint.status,
    department: complaint.department,
    createdAt: complaint.createdAt,
  };
}

export function buildNearbyHazardAlerts(complaints, { latitude, longitude, radiusKm = 3 }) {
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
    return [];
  }

  const parsedRadiusKm = Number(radiusKm) || 3;

  return complaints
    .map(normalizeComplaintShape)
    .filter(isHazardComplaint)
    .map((complaint) => {
      const distance = distanceKm(
        Number(latitude),
        Number(longitude),
        Number(complaint.latitude),
        Number(complaint.longitude),
      );

      return { complaint, distance };
    })
    .filter(({ complaint, distance }) => distance <= Math.max(parsedRadiusKm, hazardRadiusKm(complaint)))
    .sort((left, right) => left.distance - right.distance)
    .map(({ complaint, distance }) => buildHazardAlert(complaint, distance));
}
