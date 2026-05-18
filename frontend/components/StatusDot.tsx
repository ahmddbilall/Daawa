"use client";

import React, { useEffect, useState } from "react";
import { checkHealth } from "@/lib/api";
import { useI18n } from "@/lib/I18nProvider";
import type { TranslationKey } from "@/lib/i18n";

type Status = "ok" | "degraded" | "down" | "checking";

const LABEL_KEYS: Record<Status, TranslationKey> = {
  checking: "status.checking",
  ok: "status.ok",
  degraded: "status.degraded",
  down: "status.down",
};

export default function StatusDot() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let mounted = true;
    async function runProbe() {
      if (!mounted) return;
      setStatus("checking");
      try {
        const res = await checkHealth();
        if (!mounted) return;
        setStatus(res?.ollama ? "ok" : "degraded");
      } catch {
        if (mounted) setStatus("down");
      }
    }

    const frame = window.requestAnimationFrame(() => {
      void runProbe();
    });
    const id = setInterval(runProbe, 30_000);
    return () => {
      mounted = false;
      window.cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, []);

  const label = t(LABEL_KEYS[status]);

  const colorClass =
    status === "ok"
      ? "bg-[var(--color-low)] animate-pulse"
      : status === "degraded"
        ? "bg-[var(--color-high)]"
        : status === "down"
          ? "bg-[var(--color-critical)]"
          : "bg-[var(--color-medium)]";

  return (
    <div
      className="flex items-center gap-2"
      title={label}
      aria-label={t("status.healthAria", { label })}
    >
      <span className={`inline-block h-3 w-3 rounded-full ${colorClass}`} />
      <span className="hidden text-sm text-[var(--color-text-muted)] sm:inline">
        {label}
      </span>
    </div>
  );
}
