import os
import tempfile
import whisper
import asyncio

# Load the whisper model lazily to avoid blocking startup
# "tiny" or "base" is recommended for quick CPU inference
_model = None

def get_model():
    global _model
    if _model is None:
        print("Loading Whisper model...")
        _model = whisper.load_model("base")
        print("Whisper model loaded.")
    return _model

async def transcribe_audio_bytes(audio_bytes: bytes, language: str = None) -> str:
    """
    Writes audio bytes to a temp file, transcribes it using Whisper,
    and returns the text.
    """
    model = get_model()
    
    # We must save it to a temporary file because whisper expects a file path.
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as fp:
        fp.write(audio_bytes)
        temp_path = fp.name

    try:
        # Run transcription in a thread to not block the async loop
        def _transcribe():
            # Whisper can auto-detect, but providing language can be helpful if known
            options = {}
            # Map full language names to Whisper codes if possible, else rely on auto-detect
            lang_map = {
                "English": "en",
                "Urdu": "ur",
                "Spanish": "es",
                "French": "fr",
                "Arabic": "ar",
                "Hindi": "hi",
                "Swahili": "sw",
                "Hausa": "ha"
            }
            if language in lang_map:
                options["language"] = lang_map[language]
                
            return model.transcribe(temp_path, **options)

        result = await asyncio.to_thread(_transcribe)
        return result["text"].strip()
    except Exception as e:
        print(f"Transcription error: {e}")
        return ""
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
