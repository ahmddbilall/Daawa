"use client";

import React from "react";
import UrgencyBadge from "./UrgencyBadge";
import { motion } from "framer-motion";
import { TriageResult as TR } from "@/lib/api";
import { useI18n } from "@/lib/I18nProvider";

export default function TriageResult({
  result,
  onReset,
}: {
  result: TR;
  onReset: () => void;
}) {
  const { t } = useI18n();
  const likelyConditions = Array.isArray(result.likely_conditions)
    ? result.likely_conditions
    : [];
  const immediateActions = Array.isArray(result.immediate_actions)
    ? result.immediate_actions
    : [];
  const warningSigns = Array.isArray(result.warning_signs_to_watch)
    ? result.warning_signs_to_watch
    : [];
  const processingSeconds =
    typeof result.processing_time_ms === "number"
      ? (result.processing_time_ms / 1000).toFixed(1)
      : null;

  const referralText = result.refer_to_hospital
    ? t("result.referralYes", {
        timeframe: result.referral_timeframe || t("result.referralAsap"),
      })
    : t("result.referralHome");

  return (
    <div className="space-y-4">
      <UrgencyBadge level={result.urgency_level} score={result.urgency_score} />

      <div className="card">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px] md:items-start">
          <div>
            <h3 className="text-sm font-semibold">{t("result.likelyConditions")}</h3>
            {likelyConditions.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {likelyConditions.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-6 font-mono tabular-nums text-[var(--color-text-muted)]">
                      {i + 1}.
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                {t("result.none.conditions")}
              </p>
            )}
          </div>
          <div>
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-input)] p-3">
              <div className="font-medium">{t("result.referral")}</div>
              <div className="text-sm text-[var(--color-text-muted)]">{referralText}</div>
            </div>
          </div>
        </div>
      </div>

      {result.visible_observations && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="card"
        >
          <h4 className="font-semibold">{t("result.visibleObservations")}</h4>
          <p className="mt-2 text-sm">{result.visible_observations}</p>
        </motion.div>
      )}

      <div className="card">
        <h4 className="font-semibold">{t("result.immediateActions")}</h4>
        {immediateActions.length > 0 ? (
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
            {immediateActions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {t("result.none.actions")}
          </p>
        )}
      </div>

      <div className="card">
        <h4 className="font-semibold">{t("result.warningSigns")}</h4>
        {warningSigns.length > 0 ? (
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            {warningSigns.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {t("result.none.warnings")}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--color-text-muted)]">
          {processingSeconds
            ? t("result.processing", { seconds: processingSeconds })
            : t("result.processingUnavailable")}
        </div>
        <button type="button" className="btn-primary" onClick={onReset}>
          {t("result.newAssessment")}
        </button>
      </div>
    </div>
  );
}
