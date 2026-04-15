const AI_SERVICE_URL = process.env.AI_SERVICE_URL?.replace(/\/$/, "") || "http://localhost:8000";

function keywordMatch(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function localAnalysis({ title = "", description = "", location = "" }) {
  const normalized = `${title} ${description} ${location}`.toLowerCase();

  let category = "General";
  let department = "Civic Response Cell";
  let priority = "MEDIUM";

  if (keywordMatch(normalized, ["garbage", "waste", "trash"])) {
    category = "Sanitation";
    department = "Sanitation Department";
    priority = "HIGH";
  } else if (keywordMatch(normalized, ["light", "electric", "power"])) {
    category = "Electricity";
    department = "Electricity Department";
  } else if (keywordMatch(normalized, ["water", "leak", "pipeline"])) {
    category = "Water";
    department = "Water Department";
    priority = "HIGH";
  } else if (keywordMatch(normalized, ["pothole", "road", "traffic", "drainage"])) {
    category = "Roads";
    department = "Road Department";
    priority = "HIGH";
  }

  if (keywordMatch(normalized, ["fire", "accident", "flood", "unsafe"])) {
    priority = "CRITICAL";
  }

  return {
    category,
    priority,
    department,
    sentiment: priority === "CRITICAL" ? "urgent" : "concerned",
    confidence: 0.72,
    suggestedAction: `Route this complaint to ${department} for field validation.`,
    socialPost: "",
  };
}

export async function analyzeComplaint(payload) {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("AI service unavailable");
    }

    return await response.json();
  } catch (error) {
    return localAnalysis(payload);
  }
}
