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

function buildDemoUser(payload: AuthPayload) {
  return {
    id: `demo-${Date.now()}`,
    name: payload.name || "Demo Citizen",
    email: payload.email,
    role: "CITIZEN",
    createdAt: new Date().toISOString(),
  };
}

export async function loginUser(payload: AuthPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    fallbackData: {
      user: buildDemoUser(payload),
    },
  });
}

export async function registerUser(payload: AuthPayload) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    fallbackData: {
      user: buildDemoUser(payload),
    },
  });
}
