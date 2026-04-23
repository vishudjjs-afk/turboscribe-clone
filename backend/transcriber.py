import whisper
import os

model = whisper.load_model("small")

def transcribe_audio(file_path: str, language: str = None) -> dict:
    """
    Transcribe an audio file using Whisper AI
    """
    if not os.path.exists(file_path):
        return {"error": "File not found"}

    # Transcribe with optional language
    result = model.transcribe(
        file_path,
        task="transcribe",
        language=language if language != "auto" else None,
        verbose=False
    )

    # Build segments with timestamps
    segments = []
    for seg in result["segments"]:
        segments.append({
            "id": seg["id"],
            "start": round(seg["start"], 2),
            "end": round(seg["end"], 2),
            "text": seg["text"].strip()
        })

    # Generate SRT content
    srt_content = generate_srt(segments)

    return {
        "text": result["text"],
        "language": result["language"],
        "segments": segments,
        "srt": srt_content
    }

def generate_srt(segments: list) -> str:
    """Convert segments to SRT subtitle format"""
    srt = ""
    for i, seg in enumerate(segments):
        start = format_time(seg["start"])
        end = format_time(seg["end"])
        srt += f"{i+1}\n{start} --> {end}\n{seg['text']}\n\n"
    return srt

def format_time(seconds: float) -> str:
    """Convert seconds to SRT time format HH:MM:SS,mmm"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

if __name__ == "__main__":
    print("Whisper small model loaded!")
    print("SRT generation ready!")