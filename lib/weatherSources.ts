// Weather data source configuration and types

export interface WeatherSource {
  id: string;
  name: string;
  type: "station" | "model" | "api" | "scraper";
  description: string;
}

export const WEATHER_SOURCES: WeatherSource[] = [
  {
    id: "wunderground",
    name: "Weather Underground",
    type: "station",
    description: "Personal weather station data (e.g., Birdcage station)",
  },
  {
    id: "pivotal-gfs",
    name: "Pivotal Weather (GFS Model)",
    type: "model",
    description: "GFS model forecasts from Pivotal Weather",
  },
  {
    id: "noaa",
    name: "NOAA Weather",
    type: "api",
    description: "National Oceanic and Atmospheric Administration data",
  },
  {
    id: "nws-rfc",
    name: "NWS RFC Snow Pages",
    type: "scraper",
    description: "National Weather Service River Forecast Center snow data",
  },
];

// Configuration for specific weather sources
export interface WeatherSourceConfig {
  wunderground?: {
    stationId: string; // e.g., "KVTSTOW123" for a specific PWS
    apiKey?: string; // If using API, otherwise scrape from wunderground.com
  };
  pivotalWeather?: {
    latitude: number;
    longitude: number;
    model: "gfs" | "nam" | "ecmwf"; // Model type
  };
  noaa?: {
    gridpoint?: string; // e.g., "BTV/45,67" for grid-based forecasts
    stationId?: string; // e.g., "KBTV" for airport weather
  };
  nwsRfc?: {
    rfcRegion: "nerfc" | "cbrfc" | "nwrfc" | "cnrfc" | "other"; // RFC region
    siteCode?: string; // Specific site code if available
  };
}
