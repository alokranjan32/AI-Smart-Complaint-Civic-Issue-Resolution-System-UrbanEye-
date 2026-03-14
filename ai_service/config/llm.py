from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
load_dotenv()

def get_llm():
   model=os.getenv('LLM_MODEL')
   provider=os.getenv('LLM_PROVIDER')

   llm= init_chat_model(
   model=model,
   model_provider=provider,   
   )
   return llm
