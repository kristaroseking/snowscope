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
  getLocaleConfig,
  LocaleCode,
  LocaleConfig,
  translations,
  TranslationKey,
} from "@/lib/i18n";

interface LocaleContextValue {
  locale: LocaleConfig;
  setLocale: (code: LocaleCode) => void;
  /** Translate a UI string key for the active locale. */
  t: (key: TranslationKey) => string;
  /** Format a money amount using the active locale + its currency. */
  formatCurrency: (amount: number) => string;
  formatNumber: (value: number) => string;
  formatDate: (date: Date) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "snowscope-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<LocaleCode>(DEFAULT_LOCALE);

  // On mount, restore the locale from a ?locale= query param (so the mabl test
  // can deep-link a locale) or from a previous selection in localStorage.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("locale");
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const candidate = fromUrl || stored;
    if (candidate) {
      const match = getLocaleConfig(candidate);
      if (match.code === candidate) setCode(match.code);
    }
  }, []);

  const locale = useMemo(() => getLocaleConfig(code), [code]);

  // Keep the document's language and text direction in sync with the locale.
  // The mabl localization test asserts on <html dir> (ltr vs rtl).
  useEffect(() => {
    document.documentElement.lang = locale.code;
    document.documentElement.dir = locale.dir;
  }, [locale]);

  const setLocale = useCallback((next: LocaleCode) => {
    setCode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage may be unavailable (private mode); selection still applies.
    }
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const t = (key: TranslationKey) =>
      translations[locale.code]?.[key] ?? translations[DEFAULT_LOCALE][key];

    return {
      locale,
      setLocale,
      t,
      formatCurrency: (amount: number) =>
        new Intl.NumberFormat(locale.code, {
          style: "currency",
          currency: locale.currency,
        }).format(amount),
      formatNumber: (val: number) =>
        new Intl.NumberFormat(locale.code).format(val),
      formatDate: (date: Date) =>
        new Intl.DateTimeFormat(locale.code, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date),
    };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
