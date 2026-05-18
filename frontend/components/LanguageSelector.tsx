"use client";

import SUPPORTED_LANGUAGES, { type LanguageCode } from "@/lib/languages";
import { useI18n } from "@/lib/I18nProvider";
import { cn } from "@/lib/utils";

export function LanguageSelector({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <select
      className={cn(
        "input input-select h-10 w-full min-w-[10.75rem] text-sm leading-none",
        className,
      )}
      value={locale}
      onChange={(e) => setLocale(e.target.value as LanguageCode)}
      aria-label={t("language.selector")}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.nativeName}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;
