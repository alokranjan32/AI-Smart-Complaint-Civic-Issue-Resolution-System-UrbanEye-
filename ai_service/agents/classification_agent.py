from config.llm import get_llm
from langchain_core.prompts import PromptTemplate

 
llm=get_llm()

prompt=PromptTemplate(
    input_variables=["complaint"],
    template="""
    you are an AI civic  complaint  analyzer.
    your task is to analyze the complaint and return structure JSON.

    complaint:{complaint}
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
 
Priority values:
low
medium
high
 
Return ONLY valid JSON in this format:

{{
 "category": "",
 "priority": "",
 "department": ""
}}

Priority values:
low
medium
high

"""
)

chain=prompt|llm

def analyze_complaint(complaint_text):
    response=chain.invoke({
        "complaint":complaint_text
        })
    return response.content


 