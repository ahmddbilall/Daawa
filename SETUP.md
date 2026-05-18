# Daawa — Setup & Environment Guide

> **Project:** Daawa — Offline Rural Health Triage Assistant  
> **Stack:** Python FastAPI (backend) · Next.js 15 + TypeScript (frontend) · Ollama + Gemma 4 (AI)  
> **Target:** Hackathon submission — build in 24 hours

---

## 0. Prerequisites

| Tool    | Version | Why                                     |
| ------- | ------- | --------------------------------------- |
| Python  | 3.11+   | Backend runtime                         |
| Node.js | 20 LTS  | Next.js + skill CLIs                    |
| npm     | 10+     | Package manager (ships with Node.js 20) |
| Ollama  | Latest  | Local model runtime                     |
| Git     | Any     | Version control + submission            |

---

## 1. Ollama + Gemma 4 (The Core Engine)

### 1.1 Install Ollama

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows — download from https://ollama.com/download
```

### 1.2 Pull Gemma 4 Multimodal Model

```bash
# Primary: Gemma 4 E4B multimodal (vision + text)
ollama pull gemma4:e4b

# If hardware is constrained, use lighter variant
ollama pull gemma4:4b

# Verify it runs
ollama run gemma4:e4b "Hello, respond in one sentence."
```

### 1.3 Confirm Ollama API is Live

```bash
curl http://localhost:11434/api/tags
# Should return JSON listing your pulled models
```

> **Ollama runs at `http://localhost:11434` by default.**  
> It must be running before starting the backend.

---

## 2. Project Structure

```
Daawa/
├── backend/                  # Python FastAPI
│   ├── main.py               # Entry point
│   ├── routes/
│   │   ├── triage.py         # POST /api/triage
│   │   └── health.py         # GET /api/health
│   ├── services/
│   │   ├── gemma.py          # Ollama client wrapper
│   │   └── prompts.py        # Triage prompt templates
│   ├── models/
│   │   └── schemas.py        # Pydantic request/response models
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                 # Next.js 15 App
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing / Triage form
│   │   └── globals.css
│   ├── components/
│   │   ├── TriageForm.tsx     # Image upload + symptom input
│   │   ├── TriageResult.tsx   # Structured result card
│   │   ├── UrgencyBadge.tsx   # Color-coded urgency level
│   │   ├── LanguageSelector.tsx
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   ├── api.ts            # Backend calls via native fetch
│   │   ├── languages.ts      # Supported language list
│   │   └── utils.ts
│   ├── public/
│   ├── package.json
│   └── .env.local.example
│
├── SETUP.md                  # ← This file
├── PHASES.md                 # Agent progress tracker
├── DESIGN.md                 # UI/UX design system
└── README.md                 # Public-facing (for hackathon repo)
```

---

## 3. Backend Setup (Python / FastAPI)

### 3.1 Create Virtual Environment

```bash
cd Daawa/backend
python3.11 -m venv venv
source venv/bin/activate         # Windows: venv\Scripts\activate
```

### 3.2 Install Dependencies

```bash
pip install -r requirements.txt
```

**`requirements.txt`:**

```
fastapi==0.115.6
uvicorn[standard]==0.32.1
python-multipart==0.0.19      # For image file uploads
Pillow==11.1.0                 # Image processing
httpx==0.28.1                  # Async HTTP to Ollama
python-dotenv==1.0.1
pydantic==2.10.4
pydantic-settings==2.7.0
```

### 3.3 Environment Variables

```bash
cp .env.example .env
```

**`backend/.env.example`:**

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:e4b
CORS_ORIGINS=http://localhost:3000
MAX_IMAGE_SIZE_MB=10
```

### 3.4 Run Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Backend live at: `http://localhost:8000`  
Auto-generated API docs: `http://localhost:8000/docs`

---

## 4. Frontend Setup (Next.js 15)

### 4.1 Create Next.js Project

```bash
cd Daawa
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
cd frontend
```

### 4.2 Install UI Libraries

```bash
# shadcn/ui — base component system
npx shadcn@latest init
# When prompted: Default style · Slate base color · CSS variables: yes

# Add the components you need
npx shadcn@latest add button card badge select textarea label progress separator sonner

# Animation — Emil Kowalski philosophy: transitions over keyframes
npm install framer-motion

# Icons
npm install lucide-react

# File upload dropzone
npm install react-dropzone
```

> **No axios.** All HTTP calls use the **native `fetch` API** built into the browser and Node.js 20+.  
> It is zero-dependency, always available, and fully capable for this project.

### 4.3 Install Agent Skills (Run inside `frontend/`)

These skills instruct your AI coding agents to produce premium, non-generic UI:

```bash
# Emil Kowalski — animation craft, micro-interaction philosophy
npx skills add emilkowalski/skill

# Impeccable — 23 design commands, anti-slop enforcement, OKLCH color
npx skills add pbakaus/impeccable

# Taste Skill — high-agency frontend, 3-dial parameterization
npx skills add Leonxlnx/taste-skill

# UI/UX Pro Max — design intelligence, 50+ styles, 97 palettes
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uipro
mkdir -p .claude/skills
cp -r /tmp/uipro/.claude/skills/ui-ux-pro-max .claude/skills/
```

> After installing, run `/impeccable teach` in your agent to create `PRODUCT.md`.  
> Run `/impeccable document` to generate `DESIGN.md` from your tokens.

### 4.4 Environment Variables

```bash
cp .env.local.example .env.local
```

**`frontend/.env.local.example`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4.5 Run Frontend

```bash
npm run dev
```

Frontend at: `http://localhost:3000`

---

## 5. Gemma 4 — Multimodal API Usage

Ollama multimodal call (image + text in one inference):

```python
# backend/services/gemma.py
import httpx
import base64

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "gemma4:e4b"

async def run_triage(image_b64: str | None, symptoms: str, language: str) -> dict:
    payload = {
        "model": MODEL,
        "prompt": build_triage_prompt(symptoms, language),
        "stream": False,
        "options": {
            "temperature": 0.1,   # Low = consistent clinical output
            "num_predict": 1024,
        }
    }

    if image_b64:
        payload["images"] = [image_b64]

    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(OLLAMA_URL, json=payload)
        resp.raise_for_status()
        return resp.json()
```

### 5.1 Converting Uploaded Image to Base64

```python
import base64
from PIL import Image
import io

def process_image(file_bytes: bytes, max_size: int = 1024) -> str:
    img = Image.open(io.BytesIO(file_bytes))
    img.thumbnail((max_size, max_size), Image.LANCZOS)
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=85)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")
```

---

## 6. Triage Prompt Engineering

```python
# backend/services/prompts.py

SYSTEM_TEMPLATE = """You are a clinical triage assistant supporting community health workers
in resource-limited settings. You have training equivalent to a skilled nurse practitioner.

RULES:
- Never diagnose definitively — only suggest likely conditions
- Always recommend hospital referral when urgency is HIGH or CRITICAL
- Use simple, clear language appropriate for a community health worker
- If an image is provided, describe any visible symptoms you observe

Respond ONLY in valid JSON. No markdown, no preamble, no explanation.
"""

def build_triage_prompt(symptoms: str, language: str = "English") -> str:
    return f"""{SYSTEM_TEMPLATE}

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
```

---

## 7. Native Fetch API Client (Frontend)

All API communication uses the **browser-native `fetch`** — no third-party HTTP library needed.

```typescript
// frontend/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface TriageRequest {
  symptoms: string;
  language: string;
  patient_age?: string;
  image?: File | null;
}

export interface TriageResult {
  success: boolean;
  urgency_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  urgency_score: number;
  visible_observations: string | null;
  likely_conditions: string[];
  immediate_actions: string[];
  refer_to_hospital: boolean;
  referral_timeframe: string;
  warning_signs_to_watch: string[];
  response_language: string;
  processing_time_ms: number;
}

export async function submitTriage(data: TriageRequest): Promise<TriageResult> {
  const form = new FormData();
  form.append("symptoms", data.symptoms);
  form.append("language", data.language);
  if (data.patient_age) form.append("patient_age", data.patient_age);
  if (data.image) form.append("image", data.image);

  const res = await fetch(`${API_URL}/api/triage`, {
    method: "POST",
    body: form,
    // Do NOT set Content-Type — browser sets it automatically with boundary for FormData
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      (error as { detail?: string }).detail ?? `API error ${res.status}`,
    );
  }

  return res.json() as Promise<TriageResult>;
}

export async function checkHealth(): Promise<{
  status: string;
  ollama: boolean;
  model: string;
}> {
  const res = await fetch(`${API_URL}/api/health`, { cache: "no-store" });
  return res.json();
}
```

---

## 8. API Endpoints Reference

### Backend (FastAPI)

| Method | Endpoint      | Description                                |
| ------ | ------------- | ------------------------------------------ |
| `GET`  | `/api/health` | Check backend + Ollama status              |
| `POST` | `/api/triage` | Submit image + symptoms, get triage result |

### POST `/api/triage` — Request (`multipart/form-data`)

| Field         | Type   | Required | Description                         |
| ------------- | ------ | -------- | ----------------------------------- |
| `symptoms`    | string | Yes      | Patient symptom description         |
| `language`    | string | No       | Input language (default: "English") |
| `image`       | file   | No       | Photo of symptom (JPG/PNG ≤ 10MB)   |
| `patient_age` | string | No       | e.g. "3 years", "adult", "elderly"  |

### POST `/api/triage` — Response

```json
{
  "success": true,
  "urgency_level": "HIGH",
  "urgency_score": 4,
  "visible_observations": "Maculopapular rash covering face and upper torso...",
  "likely_conditions": ["Measles", "Rubella"],
  "immediate_actions": [
    "Isolate patient from others",
    "Ensure adequate hydration",
    "Monitor temperature every 2 hours"
  ],
  "refer_to_hospital": true,
  "referral_timeframe": "within 24h",
  "warning_signs_to_watch": [
    "Difficulty breathing",
    "Seizures or loss of consciousness"
  ],
  "response_language": "English",
  "processing_time_ms": 4200
}
```

---

## 9. Supported Languages

**`frontend/lib/languages.ts`:**

```typescript
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ur", label: "اردو (Urdu)", flag: "🇵🇰" },
  { code: "ha", label: "Hausa", flag: "🇳🇬" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];
```

---

## 10. Running Everything

```bash
# Terminal 1 — Ollama model server
ollama serve

# Terminal 2 — Python backend
cd Daawa/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 3 — Next.js frontend
cd Daawa/frontend
npm run dev
```

Open `http://localhost:3000`.

---

## 11. Common Issues

| Issue                              | Cause                    | Fix                                           |
| ---------------------------------- | ------------------------ | --------------------------------------------- |
| `Connection refused` on port 11434 | Ollama not running       | `ollama serve`                                |
| `model not found`                  | Model not pulled         | `ollama pull gemma4:e4b`                      |
| Response > 60s                     | Large model, slow GPU    | Switch to `gemma4:4b` in `.env`               |
| CORS error in browser              | Missing origin in config | Add `http://localhost:3000` to `CORS_ORIGINS` |
| `Failed to fetch` in UI            | Backend not running      | Start uvicorn first                           |
| Image too large                    | 10MB limit               | Compress image or raise `MAX_IMAGE_SIZE_MB`   |

---

## 12. Live Demo Deployment (Hackathon Submission)

```bash
# Step 1 — Build and deploy frontend to Vercel
cd frontend
npm run build
npx vercel --prod

# Step 2 — Tunnel local backend (Gemma 4 stays on your machine)
npx ngrok http 8000
# ngrok gives you: https://abc123.ngrok.io

# Step 3 — Set backend URL on Vercel dashboard
# Dashboard → your project → Settings → Environment Variables
# NEXT_PUBLIC_API_URL = https://abc123.ngrok.io
# Redeploy
```

> This setup proves offline AI capability (Gemma 4 runs locally, no cloud inference)  
> while giving judges a public URL for the live demo requirement.
