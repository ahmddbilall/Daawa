# Dawa (دوا) — Offline Health Triage Assistant 🩺

<img width="1849" height="895" alt="image" src="https://github.com/user-attachments/assets/c2224b57-1e48-4361-9f21-b14daf20f7aa" />

<img width="1020" height="983" alt="image" src="https://github.com/user-attachments/assets/84288cd9-fa3d-4003-ba93-ff35ec7db1c0" />


<img width="1179" height="886" alt="image" src="https://github.com/user-attachments/assets/e38317ff-75a2-42d0-8ff8-8a3c196bd818" />

--- 

**Dawa** is a fully offline, multimodal AI triage assistant designed for community health workers in remote and resource-limited environments. 

A health worker in rural Pakistan, Nigeria, or Bolivia might see 40 patients a day while the nearest doctor is hours away and internet access is nonexistent. Equipped with just a cheap laptop, a microphone, and a camera, they often have to guess between severe conditions like dengue or a simple viral rash. This happens millions of times a day.

**The Solution:** Dawa runs entirely locally using lightweight AI models. A health worker can snap a photo, record an audio description of symptoms (or type them) in their native language, and instantly receive a structured clinical assessment—including urgency level, likely conditions, and immediate actions. Zero internet. Zero cloud. Zero cost after setup.

## ✨ Key Features
- **100% Offline AI Inference:** Powered by local Ollama (Gemma 4) to ensure absolute privacy and reliability without any internet connection.
- **Multimodal Input:** Supports text descriptions, image uploads for visual symptoms (rashes, wounds, eyes), and **native audio recordings**.
- **Local Speech-to-Text:** Uses `openai-whisper` locally to transcribe spoken symptoms directly into text for the LLM to process.
- **8 Native Languages & RTL:** Deeply localized UI and inference for English, Urdu, Hausa, Spanish, Swahili, French, Arabic, and Hindi. Right-to-Left (RTL) support is automatically applied.
- **Structured Clinical Output:** Returns a highly readable triage report categorized by Urgency (CRITICAL to LOW), Likely Conditions, Immediate Actions, and Referral Timeframes.

---

## 🛠️ Tech Stack
### Frontend
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS + OKLCH custom design system
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **AI Inference:** Ollama (Gemma)
- **Speech-to-Text:** OpenAI Whisper (Local)
- **Image Processing:** Pillow (PIL)

---

## 🚀 Getting Started

### Prerequisites
1. **Node.js** (v20 LTS or higher)
2. **Python** (v3.11 or higher)
3. **Ollama** installed locally
4. **FFmpeg** installed (required for Whisper audio processing)

### 1. Model Setup
Before running the application, pull the required model via Ollama:
```bash
ollama pull gemma4:e4b
```
*(Note: If you are using a different model, update the `OLLAMA_MODEL` environment variable in the backend `.env` file).*

### 2. Backend Setup
Navigate to the `backend` directory, set up your virtual environment, and install dependencies:
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```
Run the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`.*

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory, and install the Node packages:
```bash
cd frontend
npm install
```
Start the development server:
```bash
npm run dev
```
*The web app will be available at `http://localhost:3000`.*

---

## 🔒 Security & Privacy
Dawa is designed with strict data privacy in mind. Because the models (Whisper and Gemma) run entirely on the local machine, **no patient data, images, or audio recordings ever leave the device.** There are no analytics trackers, no cloud API calls, and no external databases.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request to improve translations, optimize local inference times, or add support for smaller LLMs.

## 📜 Disclaimer
**Dawa is an AI-powered assistant and can make mistakes.** It is designed to *support* community health workers, not replace professional medical diagnosis. Always consult a healthcare professional for critical emergencies.
