const STATUS_META = {
  PENDING: {
    label: "Pending",
    shortLabel: "Not solved yet",
    helper: "Awaiting assignment",
    backgroundColor: "#fff1d9",
    borderColor: "#f3c677",
    textColor: "#9a5b00",
  },
  IN_PROGRESS: {
    label: "In Progress",
    shortLabel: "Being handled",
    helper: "Team is working on it",
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
    textColor: "#1d4ed8",
  },
  RESOLVED: {
    label: "Solved",
    shortLabel: "Resolved",
    helper: "Complaint closed",
    backgroundColor: "#dcfce7",
    borderColor: "#86efac",
    textColor: "#166534",
  },
};

const PRIORITY_META = {
  LOW: {
    label: "Low",
    backgroundColor: "#eef2ff",
    textColor: "#4f46e5",
  },
  MEDIUM: {
    label: "Medium",
    backgroundColor: "#fef3c7",
    textColor: "#b45309",
  },
  HIGH: {
    label: "High",
    backgroundColor: "#ffe4e6",
    textColor: "#be123c",
  },
  CRITICAL: {
    label: "Critical",
    backgroundColor: "#fee2e2",
    textColor: "#b91c1c",
  },
};

export const DASHBOARD_FILTERS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "RESOLVED", label: "Solved" },
];

export function getStatusMeta(status = "PENDING") {
  return STATUS_META[status] || STATUS_META.PENDING;
}

export function getPriorityMeta(priority = "MEDIUM") {
  return PRIORITY_META[priority] || PRIORITY_META.MEDIUM;
}

export function getComplaintStats(complaints = []) {
  return complaints.reduce(
    (acc, complaint) => {
      acc.total += 1;

      if (complaint.status === "RESOLVED") {
        acc.resolved += 1;
      } else if (complaint.status === "IN_PROGRESS") {
        acc.inProgress += 1;
      } else {
        acc.pending += 1;
      }

      return acc;
    },
    {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0,
    },
  );
}

export function filterComplaints(complaints = [], filter = "ALL") {
  if (filter === "ALL") {
    return complaints;
  }

  return complaints.filter((complaint) => complaint.status === filter);
}

export function getResolutionMessage(status = "PENDING") {
  if (status === "RESOLVED") {
    return "This complaint has been solved and marked closed.";
  }

  if (status === "IN_PROGRESS") {
    return "A response team is already working on this complaint.";
  }

  return "This complaint is still open and waiting for action.";
}
