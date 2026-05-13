import { apiRequest } from "../lib/api";
import { type Complaint } from "../lib/demoData";

export type ComplaintPayload = {
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  userId?: string;
};

export async function getComplaints() {
  return apiRequest<Complaint[]>("/complaints");
}

export async function createComplaint(payload: ComplaintPayload) {
  return apiRequest<Complaint>("/complaints", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
