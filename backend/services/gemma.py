import httpx
import base64
import json
import re
import os
from PIL import Image
import io

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434") + "/api/generate"
MODEL = os.getenv("OLLAMA_MODEL", "gemma4:e4b")


def process_image(file_bytes: bytes, max_size: int = 1024) -> str:
    img = Image.open(io.BytesIO(file_bytes))
    img.thumbnail((max_size, max_size), Image.LANCZOS)
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=85)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def extract_json_from_response(text: str) -> dict:
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    return {
        "urgency_level": "MEDIUM",
        "urgency_score": 3,
        "visible_observations": None,
        "likely_conditions": [
            "Unable to analyze — please consult a health professional"
        ],
        "immediate_actions": [
            "Seek guidance from nearest health professional immediately"
        ],
        "refer_to_hospital": True,
        "referral_timeframe": "within 24h",
        "warning_signs_to_watch": ["Any deterioration in the patient's condition"],
        "response_language": "English",
    }


async def run_triage(
    image_b64: str | None,
    symptoms: str,
    language: str,
    audio_b64: str | None = None,
) -> dict:
    from services.prompts import build_triage_prompt

    payload = {
        "model": MODEL,
        "prompt": build_triage_prompt(symptoms, language, has_audio=bool(audio_b64)),
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 1024,
        },
    }

    if image_b64:
        payload["images"] = [image_b64]

    async with httpx.AsyncClient(timeout=600.0) as client:
        resp = await client.post(OLLAMA_URL, json=payload)
        resp.raise_for_status()
        raw_text = resp.json().get("response", "")
        return extract_json_from_response(raw_text)
