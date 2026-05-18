export const SUPPORTED_LANGUAGES = [
  {
    code: "en",
    label: "English",
    nativeName: "English",
    flag: "🇬🇧",
    apiLabel: "English",
  },
  {
    code: "ur",
    label: "Urdu",
    nativeName: "اردو",
    flag: "🇵🇰",
    apiLabel: "Urdu",
  },
  {
    code: "ha",
    label: "Hausa",
    nativeName: "Hausa",
    flag: "🇳🇬",
    apiLabel: "Hausa",
  },
  {
    code: "es",
    label: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    apiLabel: "Spanish",
  },
  {
    code: "sw",
    label: "Swahili",
    nativeName: "Kiswahili",
    flag: "🇰🇪",
    apiLabel: "Swahili",
  },
  {
    code: "fr",
    label: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    apiLabel: "French",
  },
  {
    code: "ar",
    label: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    apiLabel: "Arabic",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    apiLabel: "Hindi",
  },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const byCode = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l.code, l]),
) as Record<LanguageCode, (typeof SUPPORTED_LANGUAGES)[number]>;

export function getLanguage(code: string): (typeof SUPPORTED_LANGUAGES)[number] {
  return byCode[code as LanguageCode] ?? SUPPORTED_LANGUAGES[0];
}

export function toApiLanguage(code: LanguageCode): string {
  return getLanguage(code).apiLabel;
}

export function isRtlLocale(code: LanguageCode): boolean {
  return code === "ar" || code === "ur";
}

export const DEFAULT_LOCALE: LanguageCode = "en";

export default SUPPORTED_LANGUAGES;
