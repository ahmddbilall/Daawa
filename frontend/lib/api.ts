const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface TriageRequest {
  symptoms: string;
  language: string;
  patient_age?: string;
  image?: File | null;
  audio?: File | null;
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
  if (data.audio) form.append("audio", data.audio);

  const res = await fetch(`${API_URL}/api/triage`, {
    method: "POST",
    body: form,
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

export default API_URL;
