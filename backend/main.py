# import openai
import google.generativeai as genai
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from firebase import initialize_firebase 

load_dotenv()

app = FastAPI(docs_url="/")
db = initialize_firebase() 

# openai.api_key = os.getenv("OPENAI_API_KEY")

genai.configure(api_key=os.getenv("GEMINIAI_API_KEY"))


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    text: str

@app.post("/ask")
async def ask_question(question: Question):
    try:
        query = question.text.strip().lower()
        docs = db.collection('faqs').where('question_lower', '==', query).get()

        if docs:
            return {
                "answer": docs[0].to_dict()['answer'],
                "source": "faq"
            }

        #  for openai 
        # response = openai.ChatCompletion.create(
        #     model="gpt-3.5-turbo",
        #     messages=[{"role": "user", "content": question.text}]
        # )

        # return {
        #     "answer": response.choices[0].message['content'],
        #     "source": "gpt-3.5-turbo"
        # }

        #  for gemini 
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(question.text)

        return {
            "answer": response.text,
            "source": "gemini-pro"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


