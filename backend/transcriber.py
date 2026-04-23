import whisper
import os

# Load the whisper model
model = whisper.load_model("small")

def transcribe_audio(file_path: str) -> dict:
    """
    Transcribe an audio file using Whisper AI
    """
    # Check if file exists
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    # Transcribe the audio
    result = model.transcribe(file_path, task="transcribe", language=None)
    
    return {
        "text": result["text"],
        "language": result["language"],
        "segments": result["segments"]
    }

# Test it
if __name__ == "__main__":
    print("Whisper model loaded successfully!")
    print("Transcriber is ready!")