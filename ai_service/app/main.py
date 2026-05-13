from fastapi import FastAPI
from pydantic import BaseModel, Field

from agents.social_agent import generate_social_post


class ComplaintPayload(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=5)
    location: str = Field(..., min_length=3)


class AnalysisResult(BaseModel):
    category: str
    priority: str
    department: str
    sentiment: str
    confidence: float
    suggestedAction: str
    socialPost: str


def keyword_match(text: str, keywords: list[str]) -> bool:
    return any(keyword in text for keyword in keywords)


def analyze_locally(payload: ComplaintPayload) -> AnalysisResult:
    text = f"{payload.title} {payload.description} {payload.location}".lower()

    category = "General"
    department = "Civic Response Cell"
    priority = "MEDIUM"
    sentiment = "concerned"

    if keyword_match(text, ["garbage", "waste", "trash"]):
        category = "Sanitation"
        department = "Sanitation Department"
        priority = "HIGH"
    elif keyword_match(text, ["light", "power", "electric"]):
        category = "Electricity"
        department = "Electricity Department"
    elif keyword_match(text, ["water", "leak", "pipeline"]):
        category = "Water"
        department = "Water Department"
        priority = "HIGH"
    elif keyword_match(text, ["pothole", "road", "traffic", "drainage"]):
        category = "Roads"
        department = "Road Department"
        priority = "HIGH"

    if keyword_match(text, ["fire", "accident", "flood", "unsafe"]):
        priority = "CRITICAL"
        sentiment = "urgent"

    action = f"Route this complaint to {department} and request field validation."
    social = generate_social_post(
        title=payload.title,
        description=payload.description,
        location=payload.location,
        category=category,
        priority=priority,
        department=department,
    )

    return AnalysisResult(
        category=category,
        priority=priority,
        department=department,
        sentiment=sentiment,
        confidence=0.74,
        suggestedAction=action,
        socialPost=social,
    )


app = FastAPI(
    title="UrbanEye AI Service",
    description="Complaint analysis and triage service for civic issue routing.",
    version="1.0.0",
)


def service_status():
    return {"ok": True, "service": "urbaneye-ai"}


@app.get("/")
def root():
    return service_status()


@app.get("/health")
def health_check():
    return service_status()


@app.post("/analyze", response_model=AnalysisResult)
def analyze_complaint(payload: ComplaintPayload):
    return analyze_locally(payload)
