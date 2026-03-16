from  config.llm import get_llm
from langchain_core.prompts import PromptTemplate

llm=get_llm()

prompt=PromptTemplate(
    input_variables=["complaints"],
    template="""


"""
)
chain=prompt|llm

def  process_complaint(complaint_text):
    
    response= chain.invoke({
       " complaints":{complaint_text}

    })
    return response.content