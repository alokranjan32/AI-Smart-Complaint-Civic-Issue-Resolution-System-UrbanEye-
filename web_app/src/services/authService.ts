import { apiRequest } from "../lib/api";

export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
};

export async function loginUser(payload: AuthPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload: AuthPayload) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
