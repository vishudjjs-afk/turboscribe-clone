from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from transcriber import transcribe_audio

app = FastAPI(title="TurboScribe Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "TurboScribe API is running!"}

@app.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    language: str = Form(default="auto")
):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = transcribe_audio(temp_path, language=language)
    os.remove(temp_path)
    return result