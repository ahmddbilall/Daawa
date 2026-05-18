SYSTEM_TEMPLATE = """You are a clinical triage assistant supporting community health workers
in resource-limited settings. You have training equivalent to a skilled nurse practitioner.

RULES:
- Never diagnose definitively — only suggest likely conditions
- Always recommend hospital referral when urgency is HIGH or CRITICAL
- Use simple, clear language appropriate for a community health worker
- If an image is provided, describe any visible symptoms you observe

Respond ONLY in valid JSON. No markdown, no preamble, no explanation.
"""


def build_triage_prompt(
    symptoms: str,
    language: str = "English",
    has_audio: bool = False,
) -> str:
    audio_note = ""
    if has_audio:
        audio_note = (
            "\nAn audio recording of the patient's symptoms was submitted by the "
            "health worker. Treat the text description as the primary source; the "
            "recording supports their spoken report.\n"
        )

    return f"""{SYSTEM_TEMPLATE}{audio_note}

Patient symptoms reported in {language}: {symptoms}

Respond with this exact JSON structure:
{{
  "urgency_level": "<CRITICAL|HIGH|MEDIUM|LOW>",
  "urgency_score": <1-5 integer>,
  "visible_observations": "<describe image findings, or null if no image>",
  "likely_conditions": ["<condition 1>", "<condition 2>"],
  "immediate_actions": ["<action 1>", "<action 2>", "<action 3>"],
  "refer_to_hospital": <true|false>,
  "referral_timeframe": "<immediately|within 24h|within 48h|routine|not required>",
  "warning_signs_to_watch": ["<sign 1>", "<sign 2>"],
  "response_language": "{language}"
}}
"""
