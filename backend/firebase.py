import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db
