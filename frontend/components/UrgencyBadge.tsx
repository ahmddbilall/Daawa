"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  LucideIcon,
} from "lucide-react";
import { useI18n } from "@/lib/I18nProvider";
import type { TranslationKey } from "@/lib/i18n";

type Level = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const LEVEL_CONFIG: Record<
  Level,
  { icon: LucideIcon; var: string; labelKey: TranslationKey; sublabelKey: TranslationKey }
> = {
  CRITICAL: {
    icon: AlertTriangle,
    var: "critical",
    labelKey: "urgency.CRITICAL.label",
    sublabelKey: "urgency.CRITICAL.sublabel",
  },
  HIGH: {
    icon: AlertCircle,
    var: "high",
    labelKey: "urgency.HIGH.label",
    sublabelKey: "urgency.HIGH.sublabel",
  },
  MEDIUM: {
    icon: Info,
    var: "medium",
    labelKey: "urgency.MEDIUM.label",
    sublabelKey: "urgency.MEDIUM.sublabel",
  },
  LOW: {
    icon: CheckCircle,
    var: "low",
    labelKey: "urgency.LOW.label",
    sublabelKey: "urgency.LOW.sublabel",
  },
};

export function UrgencyBadge({
  level,
  score,
}: {
  level: Level | string | null | undefined;
  score?: number;
}) {
  const { t } = useI18n();
  const normalizedLevel = (
    typeof level === "string" ? level.toUpperCase() : "LOW"
  ) as Level;
  const cfg = LEVEL_CONFIG[normalizedLevel] ?? LEVEL_CONFIG.LOW;
  const Icon = cfg.icon;

  const style: React.CSSProperties = {
    background: `var(--color-${cfg.var}-bg)`,
    border: `1px solid var(--color-${cfg.var}-border)`,
    color: `var(--color-text)`,
  };

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`${t(cfg.labelKey)}. ${t(cfg.sublabelKey)}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`flex w-full items-center gap-4 rounded-md p-4 ${normalizedLevel === "CRITICAL" ? "critical-pulse" : ""}`}
      style={style}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-md"
          aria-hidden
        >
          <Icon size={24} />
        </div>
        <div>
          <div className="text-lg font-bold uppercase tracking-wide">
            {t(cfg.labelKey)}
          </div>
          <div className="text-sm opacity-80">{t(cfg.sublabelKey)}</div>
          {typeof score === "number" && (
            <div className="text-sm text-[var(--color-text-muted)]">
              {t("result.score", { score })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default UrgencyBadge;
