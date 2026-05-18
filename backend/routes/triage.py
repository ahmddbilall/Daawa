from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import time
import base64
from services.gemma import run_triage, process_image
from services.audio import transcribe_audio_bytes

router = APIRouter()

SUPPORTED_LANGUAGES = [
    "English",
    "Urdu",
    "Hausa",
    "Spanish",
    "Swahili",
    "French",
    "Arabic",
    "Hindi",
]

MAX_AUDIO_BYTES = 15 * 1024 * 1024


@router.post("/triage")
async def triage(
    symptoms: str = Form(...),
    language: str = Form(default="English"),
    patient_age: Optional[str] = Form(default=None),
    image: Optional[UploadFile] = File(default=None),
    audio: Optional[UploadFile] = File(default=None),
):
    if not symptoms.strip():
        raise HTTPException(status_code=400, detail="Symptoms description is required")

    if language not in SUPPORTED_LANGUAGES:
        language = "English"

    image_b64 = None
    if image and image.filename:
        content = await image.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Image too large (max 10MB)")
        image_b64 = process_image(content)

    audio_b64 = None
    transcribed_text = None
    if audio and audio.filename:
        audio_content = await audio.read()
        if len(audio_content) > MAX_AUDIO_BYTES:
            raise HTTPException(status_code=413, detail="Audio too large (max 15MB)")
        
        # Transcribe audio using the new service
        transcribed_text = await transcribe_audio_bytes(audio_content, language)
        
        audio_b64 = base64.b64encode(audio_content).decode("utf-8")

    symptom_text = symptoms
    if transcribed_text:
        if symptom_text.startswith("[") and symptom_text.endswith("]"):
            symptom_text = transcribed_text
        else:
            symptom_text = f"{symptom_text}\n\n[Transcribed Audio]: {transcribed_text}"
    if patient_age:
        symptom_text = f"Patient age: {patient_age}. Symptoms: {symptom_text}"

    start = time.time()
    result = await run_triage(image_b64, symptom_text, language, audio_b64=audio_b64)
    elapsed_ms = int((time.time() - start) * 1000)

    result["processing_time_ms"] = elapsed_ms
    result["success"] = True

    return JSONResponse(content=result)
