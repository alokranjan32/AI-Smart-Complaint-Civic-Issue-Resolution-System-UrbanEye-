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

const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL?.replace(/\/$/, "") || "http://localhost:8000";

export async function analyzeComplaint(payload: AnalysisPayload) {
  const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Complaint analysis failed");
  }

  return (await response.json()) as AnalysisResult;
}
