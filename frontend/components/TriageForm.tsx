"use client";

import React, { useState, useEffect } from "react";
import { submitTriage, TriageResult as TR } from "@/lib/api";
import { useI18n } from "@/lib/I18nProvider";
import { toast } from "sonner";
import { Camera, Languages, Loader2, PenLine, Mic as MicIcon } from "lucide-react";
import ImageUpload from "./ImageUpload";
import AudioRecorder from "./AudioRecorder";

export default function TriageForm({
  onResult,
  prefillSymptom,
  onSymptomsChange,
}: {
  onResult: (r: TR) => void;
  prefillSymptom?: string;
  onSymptomsChange?: (hasSymptoms: boolean) => void;
}) {
  const { t, apiLanguage } = useI18n();
  const [symptoms, setSymptoms] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState<"text" | "audio">("text");

  useEffect(() => {
    if (prefillSymptom) {
      setSymptoms(prefillSymptom);
      onSymptomsChange?.(prefillSymptom.trim().length > 0);
    }
  }, [prefillSymptom]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = symptoms.trim();
    if (inputType === "text" && !trimmed) {
      return toast.error(t("form.validation.symptomsOrAudio"));
    }
    if (inputType === "audio" && !audioFile) {
      return toast.error(t("form.validation.symptomsOrAudio"));
    }

    const symptomText = inputType === "text" ? trimmed : t("form.audioAttached");

    setLoading(true);
    try {
      const res = await submitTriage({
        symptoms: symptomText,
        language: apiLanguage,
        patient_age: patientAge,
        image: imageFile,
        audio: inputType === "audio" ? audioFile : null,
      });
      onResult(res);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("form.triageFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">{t("form.intake")}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            {t("form.patientAssessment")}
          </h2>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold">{t("form.patientAge")}</label>
        <input
          className="input w-full"
          value={patientAge}
          onChange={(e) => setPatientAge(e.target.value)}
          placeholder={t("form.patientAgePlaceholder")}
          disabled={loading}
        />
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">
          {t("form.patientAgeHint")}
        </p>
      </div>

      <div className="grid gap-4">
        {/* Input Method Selector */}
        <div className="flex rounded-md bg-[var(--color-bg-input)] p-1 border border-[var(--color-border)]">
          <button
            type="button"
            className={`flex-1 rounded flex items-center justify-center gap-2 py-1.5 text-sm font-medium transition-colors ${inputType === "text" ? "bg-[var(--color-bg-elevated)] shadow-sm text-[var(--color-text)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"}`}
            onClick={() => setInputType("text")}
          >
            <PenLine size={16} /> {t("form.symptoms")}
          </button>
          <button
            type="button"
            className={`flex-1 rounded flex items-center justify-center gap-2 py-1.5 text-sm font-medium transition-colors ${inputType === "audio" ? "bg-[var(--color-bg-elevated)] shadow-sm text-[var(--color-text)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"}`}
            onClick={() => setInputType("audio")}
          >
            <MicIcon size={16} /> {t("form.inputTypeAudio")}
          </button>
        </div>

        <div className={inputType === "text" ? "block" : "hidden"}>
          <div className="grid gap-2">
            <textarea
              dir="auto"
              className="input min-h-[154px] w-full resize-y"
              placeholder={t("form.symptomsPlaceholder")}
              value={symptoms}
              onChange={(e) => {
                setSymptoms(e.target.value);
                onSymptomsChange?.(e.target.value.trim().length > 0);
              }}
              disabled={loading}
            />
            <p className="text-xs leading-5 text-[var(--color-text-muted)]">
              {t("form.symptomsHint")}
            </p>
          </div>
        </div>

        <div className={inputType === "audio" ? "block" : "hidden"}>
          <AudioRecorder onChange={setAudioFile} disabled={loading} />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-semibold">{t("form.attachPhoto")}</label>
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Camera size={13} strokeWidth={2} />
            {t("form.optional")}
          </span>
        </div>
        <ImageUpload onChange={setImageFile} disabled={loading} />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-primary flex h-11 w-full items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("form.analyzing")}
            </>
          ) : (
            <>
              <Languages className="size-4" />
              {t("form.submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
