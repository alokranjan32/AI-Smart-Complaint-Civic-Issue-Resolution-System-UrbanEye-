import { apiRequest } from "../lib/api";
import {
  demoComplaints,
  demoOverview,
  type AdminOverview,
  type Complaint,
  type ComplaintHistoryEntry,
  type User,
} from "../lib/demoData";

export async function getAdminOverview() {
  return apiRequest<AdminOverview>("/admin/overview", {
    fallbackData: demoOverview,
  });
}

export async function getAdminComplaints() {
  return apiRequest<Complaint[]>("/admin/complaints", {
    fallbackData: demoOverview.recentComplaints,
  });
}

export async function getAdminUsers() {
  return apiRequest<User[]>("/admin/users", {
    fallbackData: [
      { name: "Aarav Singh", email: "citizen@urbaneye.dev", role: "CITIZEN" },
      { name: "Meera Rao", email: "authority@urbaneye.dev", role: "AUTHORITY" },
      { name: "Sonal Verma", email: "admin@urbaneye.dev", role: "ADMIN" },
    ],
  });
}

export type ComplaintWorkflowPayload = {
  status?: string;
  department?: string;
  assignedTo?: string;
  note?: string;
};

export async function getAdminComplaint(id: string) {
  const fallbackComplaint = demoComplaints.find((complaint) => complaint.id === id) || demoComplaints[0];

  return apiRequest<Complaint>(`/admin/complaints/${id}`, {
    fallbackData: fallbackComplaint,
  });
}

export async function getAdminComplaintHistory(id: string) {
  return apiRequest<ComplaintHistoryEntry[]>(`/admin/complaints/${id}/history`, {
    fallbackData: demoComplaints.find((complaint) => complaint.id === id)?.history || [],
  });
}

export async function updateAdminComplaint(id: string, payload: ComplaintWorkflowPayload) {
  return apiRequest<Complaint>(`/admin/complaints/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    fallbackData: {
      ...(demoComplaints.find((complaint) => complaint.id === id) || demoComplaints[0]),
      ...payload,
      updatedAt: new Date().toISOString(),
    },
  });
}
