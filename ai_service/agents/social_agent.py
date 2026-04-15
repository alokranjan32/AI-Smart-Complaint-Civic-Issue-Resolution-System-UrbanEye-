from config.llm import get_llm
from langchain_core.prompts import PromptTemplate
    

llm=get_llm()
prompt=PromptTemplate(
    variabble=["complaints"],
    template="""
Generate a social media post for this civic complaint.

Complaint:
{complaint}

Include:

Location
Issue
Hashtags

Example format:

⚠️ Civic Issue Reported

Location:
Issue:

#SmartCity
#FixOurRoads
"""
)
chain=prompt|llm

def social_agent(complaint_text):
    response=chain.invoke({
        "complaints":{complaint_text}

    })
    return response.content

