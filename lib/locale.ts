export type Locale = "en" | "vi";

export const LOCALE_STORAGE_KEY = "lqc_locale";

export function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "vi";
}
