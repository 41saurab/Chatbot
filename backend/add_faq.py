import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def add_faq(question, answer):
    faq_ref = db.collection('faqs').document()
    faq_ref.set({
        "question": question,
        "question_lower": question.lower(), 
        "answer": answer
    })
    print("FAQ added successfully!")

if __name__ == "__main__":
    faqs = [
        {"question": "What is your name?", "answer": "I have no name. Please name me."},
        {"question": "When can i use you?", "answer": "I'm available everytime."},
    ]

    for faq in faqs:
        add_faq(faq["question"], faq["answer"])
