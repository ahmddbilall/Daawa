"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  type LanguageCode,
  toApiLanguage,
  isRtlLocale,
} from "@/lib/languages";
import { translate, type TranslationKey } from "@/lib/i18n";

const STORAGE_KEY = "Daawa_locale";

type I18nContextValue = {
  locale: LanguageCode;
  setLocale: (code: LanguageCode) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
  apiLanguage: string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): LanguageCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (
      stored === "en" ||
      stored === "ur" ||
      stored === "ha" ||
      stored === "es" ||
      stored === "sw" ||
      stored === "fr" ||
      stored === "ar" ||
      stored === "hi"
    ) {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

function LocaleHtmlSync({ locale }: { locale: LanguageCode }) {
  useEffect(() => {
    const dir = isRtlLocale(locale) ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return null;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LanguageCode>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setReady(true);
  }, []);

  const setLocale = useCallback((code: LanguageCode) => {
    setLocaleState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      dir: isRtlLocale(locale) ? "rtl" : "ltr",
      apiLanguage: toApiLanguage(locale),
    }),
    [locale, setLocale, t],
  );

  return (
    <I18nContext.Provider value={value}>
      {ready && <LocaleHtmlSync locale={locale} />}
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
