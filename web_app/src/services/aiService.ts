import { apiRequest } from "../lib/api";

export type AnalysisPayload = {
  title: string;
  description: string;
  location: string;
};

export type AnalysisResult = {
  category: string;
  priority: string;
  department: string;
  sentiment: string;
  confidence: number;
  suggestedAction: string;
  socialPost: string;
};

export async function analyzeComplaint(payload: AnalysisPayload) {
  return apiRequest<AnalysisResult>("/complaints", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
