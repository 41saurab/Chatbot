import openai
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from firebase import initialize_firebase 

load_dotenv()

app = FastAPI(docs_url="/")
db = initialize_firebase() 
openai.api_key = os.getenv("OPENAI_API_KEY")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    """Pydantic model for the question input."""
    text: str

@app.post("/ask")
async def ask_question(question: Question):
    """Handle the question asked by the user and return an answer."""
    try:
        query = question.text.strip().lower()
        docs = db.collection('faqs').where('question_lower', '==', query).get()

        if docs:
            return {
                "answer": docs[0].to_dict()['answer'],
                "source": "faq"
            }

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": question.text}]
        )

        return {
            "answer": response.choices[0].message['content'],
            "source": "gpt-3.5-turbo"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


