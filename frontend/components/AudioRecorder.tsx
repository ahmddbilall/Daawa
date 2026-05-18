"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/I18nProvider";
import { cn } from "@/lib/utils";

const MAX_SECONDS = 180;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function pickMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

export default function AudioRecorder({
  onChange,
  disabled = false,
}: {
  onChange: (file: File | null) => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "recording" | "recorded" | "playing">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [bars, setBars] = useState<number[]>(Array(24).fill(0.15));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const cleanupStream = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const clearRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    cleanupStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setFileName(null);
    setElapsed(0);
    setStatus("idle");
    setBars(Array(24).fill(0.15));
    onChange(null);
  }, [audioUrl, cleanupStream, onChange]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cleanupStream();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, cleanupStream]);

  const drawWaveform = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const step = Math.floor(data.length / 24);
    const next = Array.from({ length: 24 }, (_, i) => {
      const v = data[i * step] / 255;
      return Math.max(0.12, v);
    });
    setBars(next);
    rafRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawWaveform();

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        cleanupStream();
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const file = new File([blob], `symptoms-${Date.now()}.webm`, {
          type: blob.type,
        });
        const url = URL.createObjectURL(blob);
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setFileName(file.name);
        setStatus("recorded");
        onChange(file);
      };

      recorder.start(250);
      setStatus("recording");
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= MAX_SECONDS) {
            stopRecording();
            return MAX_SECONDS;
          }
          return next;
        });
      }, 1000);
    } catch {
      toast.error(t("audio.permissionDenied"));
    }
  }, [cleanupStream, disabled, drawWaveform, onChange, stopRecording, t]);

  const togglePlayback = useCallback(() => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setStatus("recorded");
    }
    const audio = audioRef.current;
    if (status === "playing") {
      audio.pause();
      setStatus("recorded");
    } else {
      void audio.play();
      setStatus("playing");
    }
  }, [audioUrl, status]);

  const progress = Math.min(100, (elapsed / MAX_SECONDS) * 100);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold">{t("audio.title")}</label>
        <span className="text-xs text-[var(--color-text-muted)]">
          {t("audio.optional")}
        </span>
      </div>

      <div
        className={cn(
          "rounded-md border border-[var(--color-border)] bg-[var(--color-bg-input)] p-4",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <div className="flex h-10 items-end justify-center gap-1" aria-hidden>
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-[var(--color-primary)] transition-[height] duration-75"
              style={{
                height: `${Math.round(h * 36)}px`,
                opacity: status === "recording" ? 1 : 0.35,
              }}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span
            className="font-mono text-xs tabular-nums text-[var(--color-text-muted)]"
            aria-live="polite"
          >
            {status === "recording"
              ? `${t("audio.recording")} · ${t("audio.timer", { elapsed: formatTime(elapsed), max: formatTime(MAX_SECONDS) })}`
              : fileName ?? t("audio.timer", { elapsed: "0:00", max: formatTime(MAX_SECONDS) })}
          </span>
          {status === "recording" && (
            <span className="inline-flex size-2 animate-pulse rounded-full bg-[var(--color-critical)]" />
          )}
        </div>

        {status === "recording" && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
            <div
              className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {status === "idle" && (
            <button
              type="button"
              className="btn-primary inline-flex h-9 items-center gap-2 px-4 text-sm"
              onClick={() => void startRecording()}
              aria-label={t("audio.record")}
            >
              <Mic size={16} />
              {t("audio.record")}
            </button>
          )}

          {status === "recording" && (
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 text-sm font-medium active:scale-[0.97]"
              onClick={stopRecording}
              aria-label={t("audio.stop")}
            >
              <Square size={14} fill="currentColor" />
              {t("audio.stop")}
            </button>
          )}

          {(status === "recorded" || status === "playing") && (
            <>
              <button
                type="button"
                className="btn-primary inline-flex h-9 items-center gap-2 px-4 text-sm"
                onClick={togglePlayback}
                aria-label={status === "playing" ? t("audio.pause") : t("audio.play")}
              >
                {status === "playing" ? <Pause size={16} /> : <Play size={16} />}
                {status === "playing" ? t("audio.pause") : t("audio.play")}
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm text-[var(--color-critical)] active:scale-[0.97]"
                onClick={clearRecording}
                aria-label={t("audio.delete")}
              >
                <Trash2 size={16} />
                {t("audio.delete")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
