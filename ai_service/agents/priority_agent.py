from config.llm import get_llm
from langchain_core.prompts import PromptTemplate


llm=get_llm()
prompt=PromptTemplate(

 
    input_variable=["complaints"]
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
"""   
)

chain=prompt|llm
def proiortize_complaint(complaints_text):

    response= chain.invoke({
       " complaints":{complaints_text}

    })
    return response.content


