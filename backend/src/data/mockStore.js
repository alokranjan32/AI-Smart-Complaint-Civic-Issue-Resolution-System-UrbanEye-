const users = [
  {
    id: "seed-user-1",
    name: "Aarav Singh",
    email: "citizen@urbaneye.dev",
    password: "$2b$10$6CE0j30w8AGfDHkJAWdH7O48nuQgJwVlQa2lkksBf3Ih.NSR9fad6",
    role: "CITIZEN",
    createdAt: "2026-03-18T08:20:00.000Z",
    xHandle: "",
    alertsEnabled: true,
    alertLatitude: 28.6139,
    alertLongitude: 77.209,
    alertRadiusKm: 3,
  },
  {
    id: "seed-user-2",
    name: "Meera Rao",
    email: "authority@urbaneye.dev",
    password: "$2b$10$6CE0j30w8AGfDHkJAWdH7O48nuQgJwVlQa2lkksBf3Ih.NSR9fad6",
    role: "AUTHORITY",
    createdAt: "2026-03-18T09:00:00.000Z",
    xHandle: "",
    alertsEnabled: false,
    alertLatitude: null,
    alertLongitude: null,
    alertRadiusKm: 3,
  },
  {
    id: "seed-user-3",
    name: "Sonal Verma",
    email: "admin@urbaneye.dev",
    password: "$2b$10$6CE0j30w8AGfDHkJAWdH7O48nuQgJwVlQa2lkksBf3Ih.NSR9fad6",
    role: "ADMIN",
    createdAt: "2026-03-18T09:30:00.000Z",
    xHandle: "",
    alertsEnabled: false,
    alertLatitude: null,
    alertLongitude: null,
    alertRadiusKm: 3,
  },
];

const complaints = [];

function createHistoryEntry({
  id = crypto.randomUUID(),
  complaintId,
  type,
  actorName,
  actorRole,
  message,
  fromStatus = null,
  toStatus = null,
  department = "",
  assignedTo = "",
  note = "",
  createdAt,
}) {
  return {
    id,
    complaintId,
    type,
    actorName,
    actorRole,
    message,
    fromStatus,
    toStatus,
    department,
    assignedTo,
    note,
    createdAt,
  };
}

const complaintHistory = {};

function decorateComplaint(complaint) {
  return {
    ...complaint,
    user: users.find((user) => user.id === complaint.userId) || null,
    history: listComplaintHistory(complaint.id),
  };
}

export function listUsers() {
  return users.map(({ password, ...user }) => user);
}

export function getRawUsers() {
  return users;
}

export function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function addUser(user) {
  users.push(user);
  return user;
}

export function getUserById(id) {
  return users.find((user) => user.id === id) || null;
}

export function updateUserPreferences(id, updates) {
  const user = users.find((item) => item.id === id);

  if (!user) {
    return null;
  }

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      user[key] = value;
    }
  });

  return user;
}

export function listComplaints() {
  return complaints
    .map(decorateComplaint)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getComplaintById(id) {
  const complaint = complaints.find((item) => item.id === id);
  return complaint ? decorateComplaint(complaint) : null;
}

export function addComplaint(complaint) {
  complaintHistory[complaint.id] = [
    createHistoryEntry({
      complaintId: complaint.id,
      type: "CREATED",
      actorName: users.find((user) => user.id === complaint.userId)?.name || "Citizen",
      actorRole: "CITIZEN",
      message: "Complaint submitted and routed for AI triage.",
      toStatus: complaint.status,
      department: complaint.department,
      note: complaint.suggestedAction || "",
      createdAt: complaint.createdAt,
    }),
  ];

  complaints.unshift(complaint);
  return decorateComplaint(complaint);
}

export function listComplaintHistory(id) {
  return [...(complaintHistory[id] || [])].sort(
    (left, right) => new Date(left.createdAt) - new Date(right.createdAt),
  );
}

export function updateComplaintWorkflow(id, updates) {
  const complaint = complaints.find((item) => item.id === id);

  if (!complaint) {
    return null;
  }

  const actorName = updates.actorName || "Admin";
  const actorRole = updates.actorRole || "ADMIN";
  const timestamp = new Date().toISOString();
  const nextStatus = updates.status || complaint.status;
  const nextDepartment = updates.department || complaint.department;
  const nextAssignedTo = updates.assignedTo ?? complaint.assignedTo ?? "";
  const nextNote = updates.note ?? complaint.adminNote ?? "";
  const entries = complaintHistory[id] || [];

  if (nextDepartment !== complaint.department || nextAssignedTo !== (complaint.assignedTo || "")) {
    entries.push(
      createHistoryEntry({
        complaintId: id,
        type: "ASSIGNED",
        actorName,
        actorRole,
        message: nextAssignedTo
          ? `Complaint assigned to ${nextAssignedTo}.`
          : `Complaint rerouted to ${nextDepartment}.`,
        fromStatus: complaint.status,
        toStatus: nextStatus,
        department: nextDepartment,
        assignedTo: nextAssignedTo,
        note: nextNote,
        createdAt: timestamp,
      }),
    );
  }

  if (nextStatus !== complaint.status) {
    entries.push(
      createHistoryEntry({
        complaintId: id,
        type: nextStatus === "RESOLVED" ? "RESOLVED" : "STATUS_UPDATED",
        actorName,
        actorRole,
        message: `Complaint status changed from ${complaint.status.replace("_", " ")} to ${nextStatus.replace("_", " ")}.`,
        fromStatus: complaint.status,
        toStatus: nextStatus,
        department: nextDepartment,
        assignedTo: nextAssignedTo,
        note: nextNote,
        createdAt: timestamp,
      }),
    );
  }

  if (updates.note && updates.note !== complaint.adminNote) {
    entries.push(
      createHistoryEntry({
        complaintId: id,
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
      }),
    );
  }

  complaintHistory[id] = entries;
  complaint.status = nextStatus;
  complaint.department = nextDepartment;
  complaint.assignedTo = nextAssignedTo;
  complaint.adminNote = nextNote;
  complaint.updatedAt = timestamp;

  return decorateComplaint(complaint);
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
    latitude: complaint.latitude,
    longitude: complaint.longitude,
    location: complaint.location,
    status: complaint.status,
    department: complaint.department,
    createdAt: complaint.createdAt,
  };
}

export function listNearbyHazardAlerts({ latitude, longitude, radiusKm = 3 }) {
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
    return [];
  }

  const parsedRadiusKm = Number(radiusKm) || 3;

  return listComplaints()
    .filter(isHazardComplaint)
    .map((complaint) => {
      const distance = distanceKm(
        Number(latitude),
        Number(longitude),
        Number(complaint.latitude),
        Number(complaint.longitude),
      );

      return {
        complaint,
        distance,
      };
    })
    .filter(({ complaint, distance }) => distance <= Math.max(parsedRadiusKm, hazardRadiusKm(complaint)))
    .sort((left, right) => left.distance - right.distance)
    .map(({ complaint, distance }) => buildHazardAlert(complaint, distance));
}

export function listUserHazardAlerts(userId) {
  const user = getUserById(userId);

  if (!user || !user.alertsEnabled) {
    return [];
  }

  return listNearbyHazardAlerts({
    latitude: user.alertLatitude,
    longitude: user.alertLongitude,
    radiusKm: user.alertRadiusKm || 3,
  });
}

export function getAnalytics() {
  const items = listComplaints();
  const statusBreakdown = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  const priorityBreakdown = items.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {});
  const departmentBreakdown = items.reduce((acc, item) => {
    acc[item.department] = (acc[item.department] || 0) + 1;
    return acc;
  }, {});

  return {
    totals: {
      complaints: items.length,
      pending: statusBreakdown.PENDING || 0,
      inProgress: statusBreakdown.IN_PROGRESS || 0,
      resolved: statusBreakdown.RESOLVED || 0,
      users: users.length,
    },
    statusBreakdown,
    priorityBreakdown,
    departmentBreakdown,
    recentComplaints: items.slice(0, 5),
  };
}

export function getMapHotspots() {
  return listComplaints().map((item) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    latitude: item.latitude,
    longitude: item.longitude,
    category: item.category,
    priority: item.priority,
    status: item.status,
  }));
}
