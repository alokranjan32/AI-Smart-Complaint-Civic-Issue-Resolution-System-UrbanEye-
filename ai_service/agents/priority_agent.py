from config.llm import get_llm
from langchain_core.prompts import PromptTemplate


prompt = PromptTemplate(
    input_variables=["complaint"],
    template="""
    Determine priority of this civic complaint.

Complaint:
{complaint}

Rules:

HIGH:
- accidents
- hospital area
- dangerous roads

MEDIUM:
- drainage issues
- water leak

LOW:
- garbage collection

Return only one value:

low
medium
high
""",
)


def prioritize_complaint(complaint_text):
    chain = prompt | get_llm()
    response = chain.invoke({"complaint": complaint_text})

    return response.content


def proiortize_complaint(complaints_text):
    return prioritize_complaint(complaints_text)
