"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import BrandLeaf from "@/components/BrandLeaf";
import TriageForm from "@/components/TriageForm";
import TriageResult from "@/components/TriageResult";
import LanguageSelector from "@/components/LanguageSelector";
import { TriageResult as TR } from "@/lib/api";
import { useI18n } from "@/lib/I18nProvider";

export default function HomePage() {
  const { t, locale } = useI18n();
  const [result, setResult] = useState<TR | null>(null);
  const [prefillSymptom, setPrefillSymptom] = useState<string>("");
  const [hasSymptoms, setHasSymptoms] = useState(false);

  return (
    <motion.div
      key={locale}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[100dvh] bg-[var(--color-bg)] px-3 py-3 text-[var(--color-text)] sm:px-4 lg:px-5"
    >
      <header className="mx-auto mb-5 max-w-6xl relative">
        <div className="flex items-center gap-3">
          <BrandLeaf className="h-10 w-10 text-[var(--color-primary)]" />
          <div className="min-w-0">
            <p className="text-2xl font-semibold tracking-tight">Daawa</p>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              {t("app.tagline")}
            </p>
          </div>
          <div className="ms-auto w-32 sm:w-[11.25rem] shrink-0">
            <LanguageSelector />
          </div>
        </div>

        <div className="mt-6 max-w-3xl">
          <p className="eyebrow">{t("app.eyebrow.workspace")}</p>
          <h1 className="mt-2 text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.025em] sm:text-4xl sm:leading-[1.1]">
            {t("app.hero.title")}
          </h1>
          <p className="mt-3 max-w-[66ch] text-[15px] leading-7 text-[var(--color-text-muted)]">
            {t("app.hero.subtitle")}
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
        <section className="panel p-4 sm:p-5">
          <TriageForm
            onResult={setResult}
            prefillSymptom={prefillSymptom}
            onSymptomsChange={setHasSymptoms}
          />
        </section>

        <aside className="panel min-h-[500px] p-4 sm:p-5">
          {result ? (
            <TriageResult result={result} onReset={() => setResult(null)} />
          ) : (
            <div className="flex min-h-[450px] flex-col items-center justify-center text-center text-[var(--color-text-muted)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-primary)]">
                <Activity size={24} strokeWidth={2} />
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-tight text-[var(--color-text)]">
                {t("app.empty.title")}
              </h2>
              <p className="mt-2 max-w-[42ch] text-sm leading-6">
                {t("app.empty.description")}
              </p>

              {!hasSymptoms && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {(["app.empty.chip1", "app.empty.chip2", "app.empty.chip3"] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setPrefillSymptom(t(key))}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>
      </main>

      <footer className="mx-auto mt-6 max-w-6xl pb-4 text-center">
        <p className="text-xs text-[var(--color-text-muted)] opacity-70">
          {t("app.footer.disclaimer")}
        </p>
      </footer>
    </motion.div>
  );
}
