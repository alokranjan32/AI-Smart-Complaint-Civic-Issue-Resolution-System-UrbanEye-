import { apiRequest } from "../lib/api";
import {
  type AdminOverview,
  type Complaint,
  type ComplaintHistoryEntry,
  type User,
} from "../lib/demoData";

export async function getAdminOverview() {
  return apiRequest<AdminOverview>("/admin/overview");
}

export async function getAdminComplaints() {
  return apiRequest<Complaint[]>("/admin/complaints");
}

export async function getAdminUsers() {
  return apiRequest<User[]>("/admin/users");
}

export type ComplaintWorkflowPayload = {
  status?: string;
  department?: string;
  assignedTo?: string;
  note?: string;
};

export async function getAdminComplaint(id: string) {
  return apiRequest<Complaint>(`/admin/complaints/${id}`);
}

export async function getAdminComplaintHistory(id: string) {
  return apiRequest<ComplaintHistoryEntry[]>(`/admin/complaints/${id}/history`);
}

export async function updateAdminComplaint(id: string, payload: ComplaintWorkflowPayload) {
  return apiRequest<Complaint>(`/admin/complaints/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
