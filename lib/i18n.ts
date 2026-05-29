// Localization (i18n) configuration for Snowscope.
//
// Drives the language/locale selector and all localized UI text, currency,
// number, and date formatting. Locale codes and currencies mirror the
// "Localization Testing" data table used by the Snowscope Localization mabl test.

export type LocaleCode = "en-US" | "es-ES" | "fr-FR" | "de-DE" | "ja-JP" | "ar-SA";

export interface LocaleConfig {
  code: LocaleCode;
  /** Native language name shown in the selector. */
  language: string;
  country: string;
  /** ISO 4217 currency code used for Intl currency formatting. */
  currency: string;
  dir: "ltr" | "rtl";
}

export const LOCALES: LocaleConfig[] = [
  { code: "en-US", language: "English", country: "United States", currency: "USD", dir: "ltr" },
  { code: "es-ES", language: "Español", country: "Spain", currency: "EUR", dir: "ltr" },
  { code: "fr-FR", language: "Français", country: "France", currency: "EUR", dir: "ltr" },
  { code: "de-DE", language: "Deutsch", country: "Germany", currency: "EUR", dir: "ltr" },
  { code: "ja-JP", language: "日本語", country: "Japan", currency: "JPY", dir: "ltr" },
  { code: "ar-SA", language: "العربية", country: "Saudi Arabia", currency: "SAR", dir: "rtl" },
];

export const DEFAULT_LOCALE: LocaleCode = "en-US";

export type TranslationKey =
  | "greeting"
  | "tagline"
  | "today"
  | "passesFrom"
  | "search"
  | "resorts"
  | "backcountry"
  | "tripPlanning"
  | "mapView"
  | "region"
  | "mountainDaddy"
  | "mostSnow"
  | "noResorts"
  | "footer";

export const translations: Record<LocaleCode, Record<TranslationKey, string>> = {
  "en-US": {
    greeting: "Welcome",
    tagline: "Reliable snow forecasting",
    today: "Today",
    passesFrom: "Day passes from",
    search: "Search resorts...",
    resorts: "Resorts",
    backcountry: "Backcountry",
    tripPlanning: "Trip Planning",
    mapView: "Map View",
    region: "Geographic Region",
    mountainDaddy: "Mountain Daddy",
    mostSnow: "Most snow",
    noResorts: "No resorts found for this region.",
    footer: "Powered by NOAA, GFS, and HRRR weather models",
  },
  "es-ES": {
    greeting: "Bienvenido",
    tagline: "Pronósticos de nieve fiables",
    today: "Hoy",
    passesFrom: "Forfaits desde",
    search: "Buscar estaciones...",
    resorts: "Estaciones",
    backcountry: "Fuera de pista",
    tripPlanning: "Planificar viaje",
    mapView: "Mapa",
    region: "Región geográfica",
    mountainDaddy: "Forfait de montaña",
    mostSnow: "Más nieve",
    noResorts: "No se encontraron estaciones para esta región.",
    footer: "Con tecnología de los modelos meteorológicos NOAA, GFS y HRRR",
  },
  "fr-FR": {
    greeting: "Bienvenue",
    tagline: "Prévisions d'enneigement fiables",
    today: "Aujourd'hui",
    passesFrom: "Forfaits à partir de",
    search: "Rechercher des stations...",
    resorts: "Stations",
    backcountry: "Hors-piste",
    tripPlanning: "Planifier un voyage",
    mapView: "Carte",
    region: "Région géographique",
    mountainDaddy: "Forfait montagne",
    mostSnow: "Le plus de neige",
    noResorts: "Aucune station trouvée pour cette région.",
    footer: "Propulsé par les modèles météo NOAA, GFS et HRRR",
  },
  "de-DE": {
    greeting: "Willkommen",
    tagline: "Zuverlässige Schneevorhersagen",
    today: "Heute",
    passesFrom: "Tagespässe ab",
    search: "Skigebiete suchen...",
    resorts: "Skigebiete",
    backcountry: "Backcountry",
    tripPlanning: "Reiseplanung",
    mapView: "Karte",
    region: "Geografische Region",
    mountainDaddy: "Bergpass",
    mostSnow: "Meiste Schnee",
    noResorts: "Keine Skigebiete für diese Region gefunden.",
    footer: "Bereitgestellt durch die Wettermodelle NOAA, GFS und HRRR",
  },
  "ja-JP": {
    greeting: "ようこそ",
    tagline: "信頼できる積雪予報",
    today: "今日",
    passesFrom: "リフト券",
    search: "スキー場を検索...",
    resorts: "スキー場",
    backcountry: "バックカントリー",
    tripPlanning: "旅行プラン",
    mapView: "地図",
    region: "地域",
    mountainDaddy: "シーズンパス",
    mostSnow: "最も雪が多い",
    noResorts: "この地域のスキー場は見つかりませんでした。",
    footer: "NOAA、GFS、HRRR の気象モデルを利用",
  },
  "ar-SA": {
    greeting: "مرحبا",
    tagline: "توقعات ثلوج موثوقة",
    today: "اليوم",
    passesFrom: "تذاكر يومية من",
    search: "ابحث عن المنتجعات...",
    resorts: "المنتجعات",
    backcountry: "خارج المسارات",
    tripPlanning: "تخطيط الرحلة",
    mapView: "الخريطة",
    region: "المنطقة الجغرافية",
    mountainDaddy: "تصريح الجبل",
    mostSnow: "الأكثر ثلجًا",
    noResorts: "لم يتم العثور على منتجعات لهذه المنطقة.",
    footer: "مدعوم بنماذج الطقس NOAA و GFS و HRRR",
  },
};

export function getLocaleConfig(code: string | null | undefined): LocaleConfig {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}
