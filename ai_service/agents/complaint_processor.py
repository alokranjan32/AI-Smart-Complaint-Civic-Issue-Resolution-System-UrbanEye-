from config.llm import get_llm
from langchain_core.prompts import PromptTemplate

llm = get_llm()

prompt = PromptTemplate(
    input_variables=["complaint"],
    template="""
You are an AI civic complaint analyzer.

Analyze the complaint and return structured JSON.

Complaint:
{complaint}

Categories:
- pothole
- garbage
- drainage
- streetlight
- water leak

Departments:
- Road Department
- Sanitation Department
- Water Department
- Electricity Department

Return ONLY valid JSON in this format:

{
 "category": "",
 "priority": "",
 "department": ""
}

Priority values:
low
medium
high
"""
)

chain = prompt | llm


def process_complaint(complaint_text):

    response = chain.invoke({
        "complaint": complaint_text
    })

    return response.content


 