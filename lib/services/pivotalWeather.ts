// Pivotal Weather integration for GFS model data
// Note: Pivotal Weather doesn't have a public API, but provides map tiles and data layers

export interface PivotalWeatherConfig {
  latitude: number;
  longitude: number;
  model: "gfs" | "nam" | "ecmwf" | "gefs" | "hrrr";
}

export interface PivotalModelData {
  model: string;
  initTime: string;
  validTime: string;
  forecast: {
    temp: number;
    snowfall: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
  };
}

/**
 * Pivotal Weather doesn't have a public API for point data extraction.
 * Options:
 * 1. Use their map tiles and extract data from images (complex)
 * 2. Use GFS data directly from NOAA servers
 * 3. Use another GFS provider like Open-Meteo or Weatherbit
 *
 * For now, this will integrate with NOAA's GFS GRIB2 data or Open-Meteo
 */

/**
 * Alternative: Use Open-Meteo for GFS model data (free, no API key!)
 * https://open-meteo.com/
 */
export async function fetchGFSModelData(
  latitude: number,
  longitude: number
): Promise<any | null> {
  try {
    // Open-Meteo provides free access to GFS, ECMWF, and other models
    const url = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${latitude}&longitude=${longitude}` +
      `&hourly=temperature_2m,snowfall,windspeed_10m,winddirection_10m,precipitation` +
      `&daily=temperature_2m_max,temperature_2m_min,snowfall_sum,windspeed_10m_max` +
      `&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch` +
      `&timezone=auto&forecast_days=16`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Open-Meteo GFS error:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching GFS model data:", error);
    return null;
  }
}

/**
 * Get ensemble forecast data (GEFS) for uncertainty/probability
 */
export async function fetchGEFSEnsembleData(
  latitude: number,
  longitude: number
): Promise<any | null> {
  try {
    const url = `https://ensemble-api.open-meteo.com/v1/ensemble?` +
      `latitude=${latitude}&longitude=${longitude}` +
      `&hourly=temperature_2m,snowfall,windspeed_10m` +
      `&models=gfs_seamless` +
      `&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch` +
      `&forecast_days=16`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Open-Meteo GEFS error:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching GEFS ensemble data:", error);
    return null;
  }
}

/**
 * Get high-resolution HRRR model data (better for short-term forecasts)
 */
export async function fetchHRRRModelData(
  latitude: number,
  longitude: number
): Promise<any | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${latitude}&longitude=${longitude}` +
      `&hourly=temperature_2m,snowfall,windspeed_10m,winddirection_10m` +
      `&models=hrrr` +
      `&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch` +
      `&forecast_days=2`; // HRRR only goes 48 hours

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Open-Meteo HRRR error:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching HRRR model data:", error);
    return null;
  }
}

/**
 * Get historical snowfall data for the past 30 days to estimate base depth
 */
export async function fetchHistoricalSnowfall(
  latitude: number,
  longitude: number
): Promise<any | null> {
  try {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Get 30 days ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30);
    const startDateStr = startDate.toISOString().split('T')[0];

    const url = `https://archive-api.open-meteo.com/v1/archive?` +
      `latitude=${latitude}&longitude=${longitude}` +
      `&start_date=${startDateStr}&end_date=${endDate}` +
      `&daily=snowfall_sum` +
      `&temperature_unit=fahrenheit&precipitation_unit=inch` +
      `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Open-Meteo historical snowfall error:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching historical snowfall data:", error);
    return null;
  }
}
