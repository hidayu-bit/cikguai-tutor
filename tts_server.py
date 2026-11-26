from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import edge_tts

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simpan audio yang sudah dijana dalam memori supaya kali kedua 0 delay
AUDIO_CACHE: dict[tuple, bytes] = {}

class TTSRequest(BaseModel):
    text: str
    tutor: str = "Ruby"
    language: str = "Bahasa Melayu"
    speed: float = 1.0

@app.post("/api/tts")
async def generate_tts(req: TTSRequest):
    cache_key = (req.text, req.tutor, req.language, round(req.speed, 2))
    if cache_key in AUDIO_CACHE:
        return Response(content=AUDIO_CACHE[cache_key], media_type="audio/mpeg")

    is_bm = req.language == "Bahasa Melayu"
    if is_bm:
        voice = "ms-MY-YasminNeural" if req.tutor == "Ruby" else "ms-MY-OsmanNeural"
        pitch = "+4Hz" if req.tutor == "Ruby" else "-2Hz"
    else:
        voice = "en-US-JennyNeural" if req.tutor == "Ruby" else "en-US-GuyNeural"
        pitch = "+3Hz" if req.tutor == "Ruby" else "-2Hz"

    rate_pct = int(round((req.speed - 1.0) * 100))
    rate_str = f"{rate_pct:+d}%"

    communicate = edge_tts.Communicate(
        text=req.text,
        voice=voice,
        rate=rate_str,
        pitch=pitch
    )

    audio_bytes = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_bytes += chunk["data"]

    AUDIO_CACHE[cache_key] = audio_bytes
    return Response(content=audio_bytes, media_type="audio/mpeg")