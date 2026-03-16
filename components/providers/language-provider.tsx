"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { isLocale, LOCALE_STORAGE_KEY, type Locale } from "@/lib/locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(savedLocale) ? savedLocale : "en";
  });

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      toggleLocale: () => setLocaleState((previous) => (previous === "en" ? "vi" : "en"))
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}
