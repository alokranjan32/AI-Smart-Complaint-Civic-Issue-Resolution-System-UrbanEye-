import { apiRequest } from "../lib/api";
import { demoComplaints, type Complaint } from "../lib/demoData";

export type ComplaintPayload = {
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image?: string;
};

function buildFallbackSocialPost(payload: ComplaintPayload) {
  return `Civic update: ${payload.title} at ${payload.location}. ${payload.description} #CityUpdate #CivicAction`;
}

export async function getComplaints() {
  return apiRequest<Complaint[]>("/complaints", {
    fallbackData: demoComplaints,
  });
}

export async function createComplaint(payload: ComplaintPayload) {
  return apiRequest<Complaint>("/complaints", {
    method: "POST",
    body: JSON.stringify(payload),
    fallbackData: {
      id: `demo-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      location: payload.location,
      category: "General",
      priority: "MEDIUM",
      status: "PENDING",
      department: "Civic Response Cell",
      createdAt: new Date().toISOString(),
      socialPost: buildFallbackSocialPost(payload),
    },
  });
}
