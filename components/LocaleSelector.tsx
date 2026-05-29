"use client";

import { LOCALES, LocaleCode } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

/**
 * Language / locale selector. Lets the user switch the site's locale, which
 * updates all localized text, currency/number/date formatting, and the page
 * text direction (ltr/rtl).
 */
export default function LocaleSelector() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="text-slate-400 text-lg">
        🌐
      </span>
      <select
        aria-label="Language"
        data-testid="locale-selector"
        value={locale.code}
        onChange={(e) => setLocale(e.target.value as LocaleCode)}
        className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent cursor-pointer"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.language}
          </option>
        ))}
      </select>
    </div>
  );
}
