import { apiRequest } from "../lib/api";
import { demoOverview, type AdminOverview, type Complaint, type User } from "../lib/demoData";

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
