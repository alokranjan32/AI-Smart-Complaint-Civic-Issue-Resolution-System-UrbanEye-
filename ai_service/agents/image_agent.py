from config.llm import get_llm
import base64 
from  PIL import Image
from langchain_core.prompts import PromptTemplate

llm=get_llm()
def encode_image(image_path):
    with open(image_path,"rb") as image_file:
        return base64.b64encoded(img.read()).decode("utf-8")
    



prompt=PromptTemplate(
    input_variables=["complaint"],
    template="""


{complaint}
    """
)

def  analyze_image(complaint_text):

    response=llm.invoke({
       " complaint":{complaint_text}
    })
    return response.content

