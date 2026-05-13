from __future__ import annotations

import os
import re
from typing import Any

MAX_X_POST_LENGTH = 280

CATEGORY_HASHTAGS = {
    "Sanitation": ["#CleanStreets", "#CivicAction"],
    "Electricity": ["#StreetlightFix", "#CivicAction"],
    "Water": ["#WaterAlert", "#CivicAction"],
    "Roads": ["#RoadSafety", "#CivicAction"],
    "General": ["#CityUpdate", "#CivicAction"],
}


def _compact_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def _trim_to_length(value: str, limit: int) -> str:
    compact = _compact_text(value)
    if len(compact) <= limit:
        return compact
    trimmed = compact[: max(limit - 1, 0)].rstrip(" ,.;:-")
    return f"{trimmed}…" if trimmed else compact[:limit]


def _hashtags_for_category(category: str) -> str:
    tags = CATEGORY_HASHTAGS.get(category, CATEGORY_HASHTAGS["General"])
    return " ".join(tags)


def build_fallback_social_post(
    *,
    title: str,
    description: str,
    location: str,
    category: str,
    priority: str,
    department: str,
) -> str:
    priority_prefix = {
        "CRITICAL": "Urgent civic alert:",
        "HIGH": "High-priority civic alert:",
        "MEDIUM": "Civic update:",
        "LOW": "Civic update:",
    }.get(priority, "Civic update:")

    issue_summary = _trim_to_length(description or title, 85)
    hashtags = _hashtags_for_category(category)

    post = (
        f"{priority_prefix} {title} at {location}. "
        f"{issue_summary} Assigned to {department}. {hashtags}"
    )
    return _trim_to_length(post, MAX_X_POST_LENGTH)


def _llm_is_configured() -> bool:
    return bool(os.getenv("LLM_MODEL") and os.getenv("LLM_PROVIDER"))


def _extract_response_text(response: Any) -> str:
    if hasattr(response, "content"):
        return _compact_text(str(response.content))
    return _compact_text(str(response))


def generate_social_post(
    *,
    title: str,
    description: str,
    location: str,
    category: str,
    priority: str,
    department: str,
) -> str:
    fallback = build_fallback_social_post(
        title=title,
        description=description,
        location=location,
        category=category,
        priority=priority,
        department=department,
    )

    if not _llm_is_configured():
        return fallback

    try:
        from langchain_core.prompts import ChatPromptTemplate

        from config.llm import get_llm

        llm = get_llm()
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    (
                        "You write concise X posts for civic issue automation. "
                        f"Return exactly one post under {MAX_X_POST_LENGTH} characters. "
                        "Mention the issue and location, keep the tone factual and public-safe, "
                        "and end with two short relevant hashtags. No markdown fences."
                    ),
                ),
                (
                    "human",
                    (
                        "Title: {title}\n"
                        "Description: {description}\n"
                        "Location: {location}\n"
                        "Category: {category}\n"
                        "Priority: {priority}\n"
                        "Assigned department: {department}"
                    ),
                ),
            ]
        )
        chain = prompt | llm
        response = chain.invoke(
            {
                "title": title,
                "description": description,
                "location": location,
                "category": category,
                "priority": priority,
                "department": department,
            }
        )
        candidate = _trim_to_length(_extract_response_text(response), MAX_X_POST_LENGTH)
        return candidate or fallback
    except Exception:
        return fallback
