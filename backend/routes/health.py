from fastapi import APIRouter
import httpx
import os

router = APIRouter()


@router.get("/health")
async def health_check():
    ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    model = os.getenv("OLLAMA_MODEL", "gemma4:e4b")

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{ollama_url}/api/tags")
            models = [m["name"] for m in resp.json().get("models", [])]
            ollama_ok = any(model.split(":")[0] in m for m in models)
    except Exception as e:
        return {"status": "degraded", "ollama": False, "error": str(e)}

    return {
        "status": "ok" if ollama_ok else "degraded",
        "ollama": ollama_ok,
        "model": model,
        "api_version": "1.0.0",
    }
