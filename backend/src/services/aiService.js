const AI_SERVICE_URL = process.env.AI_SERVICE_URL?.replace(/\/$/, "") || "http://localhost:8000";

const SOCIAL_HASHTAGS = {
  Sanitation: ["#CleanStreets", "#CivicAction"],
  Electricity: ["#StreetlightFix", "#CivicAction"],
  Water: ["#WaterAlert", "#CivicAction"],
  Roads: ["#RoadSafety", "#CivicAction"],
  General: ["#CityUpdate", "#CivicAction"],
};

function keywordMatch(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function compactText(text = "") {
  return text.replace(/\s+/g, " ").trim();
}

function trimToLength(text, limit) {
  const compact = compactText(text);
  if (compact.length <= limit) {
    return compact;
  }

  const trimmed = compact.slice(0, Math.max(limit - 1, 0)).replace(/[ ,.;:-]+$/, "");
  return `${trimmed}…`;
}

function buildSocialPost({ title = "", description = "", location = "", category = "General", priority = "MEDIUM", department = "Civic Response Cell" }) {
  const prefixByPriority = {
    CRITICAL: "Urgent civic alert:",
    HIGH: "High-priority civic alert:",
    MEDIUM: "Civic update:",
    LOW: "Civic update:",
  };
  const hashtags = (SOCIAL_HASHTAGS[category] || SOCIAL_HASHTAGS.General).join(" ");
  const issueSummary = trimToLength(description || title, 85);

  return trimToLength(
    `${prefixByPriority[priority] || prefixByPriority.MEDIUM} ${title} at ${location}. ${issueSummary} Assigned to ${department}. ${hashtags}`,
    280,
  );
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
    socialPost: buildSocialPost({
      title,
      description,
      location,
      category,
      priority,
      department,
    }),
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
