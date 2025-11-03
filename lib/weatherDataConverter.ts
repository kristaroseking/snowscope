import { Resort, ResortWeather, CurrentConditions, DailyForecast, HourlyForecast, ElevationHourlyForecast } from "@/types";
import { aggregateWeatherData, adjustForElevation, AggregatedWeatherData } from "./services/weatherAggregator";

/**
 * Convert aggregated weather data to ResortWeather format
 */
export async function getResortWeatherData(resort: Resort): Promise<ResortWeather> {
  // Fetch base elevation data
  const baseData = await aggregateWeatherData(resort);

  // Get data for different elevations
  const baseAdjusted = adjustForElevation(baseData, resort.elevations.mid, resort.elevations.base);
  const midData = baseData; // Mid is our reference
  const summitAdjusted = adjustForElevation(baseData, resort.elevations.mid, resort.elevations.summit);

  return {
    resort,
    current: {
      base: convertToCurrentConditions(baseAdjusted),
      mid: convertToCurrentConditions(midData),
      summit: convertToCurrentConditions(summitAdjusted),
    },
    forecast: {
      base: convertToForecast(baseAdjusted),
      mid: convertToForecast(midData),
      summit: convertToForecast(summitAdjusted),
    },
    hourly: {
      base: convertToHourlyForecast(baseAdjusted),
      mid: convertToHourlyForecast(midData),
      summit: convertToHourlyForecast(summitAdjusted),
    },
    lastUpdated: baseData.metadata.lastUpdated,
  };
}

function convertToCurrentConditions(data: AggregatedWeatherData): CurrentConditions {
  const current = data.combined.current;
  const forecast = data.combined.forecast[0]; // Use today's forecast for some fields

  return {
    temp: Math.round(current.temp),
    feelsLike: Math.round(current.temp - (current.windSpeed * 0.7)), // Simple wind chill approximation
    windSpeed: Math.round(current.windSpeed),
    windDirection: 0, // Not available from current sources
    humidity: current.humidity || 70,
    visibility: 10, // Default
    snowfall24h: current.snowfall24h || 0,
    snowfall48h: (current.snowfall24h || 0) * 2, // Approximation
    snowDepth: current.snowDepth, // Pass through snow depth from aggregated sources
    weatherDescription: getWeatherDescription(forecast?.snowAccumulation || 0, current.temp),
    weatherIcon: getWeatherIcon(forecast?.snowAccumulation || 0, current.temp),
    timestamp: data.metadata.lastUpdated,
  };
}

function convertToForecast(data: AggregatedWeatherData): DailyForecast[] {
  return data.combined.forecast.map((day) => ({
    date: day.date,
    tempHigh: Math.round(day.tempHigh),
    tempLow: Math.round(day.tempLow),
    snowAccumulation: Math.round(day.snowAccumulation * 10) / 10, // Round to 1 decimal
    windSpeed: Math.round(day.windSpeed),
    weatherDescription: getWeatherDescription(day.snowAccumulation, (day.tempHigh + day.tempLow) / 2),
    weatherIcon: getWeatherIcon(day.snowAccumulation, (day.tempHigh + day.tempLow) / 2),
  }));
}

function getWeatherDescription(snow: number, temp: number): string {
  if (snow > 6) return "❄️❄️";
  if (snow > 3) return "🌨️";
  if (snow > 0.5) return "🌨";
  if (temp < 32) return "⛅";
  if (temp < 45) return "☁️";
  return "☁️";
}

function getWeatherIcon(snow: number, temp: number): string {
  if (snow > 3) return "snow";
  if (snow > 0.5) return "snow-light";
  if (temp < 32) return "cloud";
  return "cloud-sun";
}

function convertToHourlyForecast(data: AggregatedWeatherData): HourlyForecast[] {
  const hourlyData: HourlyForecast[] = [];

  // Prioritize HRRR (48 hours, high resolution) then GFS (longer range)
  const hrrrData = data.sources.hrrr;
  const gfsData = data.sources.gfs;

  // Use HRRR if available (more accurate short-term)
  if (hrrrData?.hourly) {
    const { time, temperature_2m, snowfall, windspeed_10m, winddirection_10m } = hrrrData.hourly;

    // Take first 240 hours (10 days) from HRRR
    const hoursToTake = Math.min(240, time?.length || 0);

    for (let i = 0; i < hoursToTake; i++) {
      // Calculate cloud cover estimate based on temperature and conditions
      const temp = temperature_2m?.[i] || 30;
      const snow = snowfall?.[i] || 0;

      // Estimate cloud cover (simplified)
      let cloudCover = 50; // default
      if (snow > 0.1) {
        cloudCover = Math.min(90, 70 + snow * 10); // Snowing = high clouds
      } else if (temp < 32) {
        cloudCover = 40; // Cold but clear
      }

      hourlyData.push({
        time: time[i],
        temp: Math.round(temp),
        windSpeed: Math.round(windspeed_10m?.[i] || 0),
        snowAccumulation: Math.round((snow || 0) * 10) / 10,
        weatherDescription: getWeatherDescription(snow || 0, temp),
        weatherIcon: getWeatherIcon(snow || 0, temp),
        cloudCover: Math.round(cloudCover),
        precipitation: snow || 0,
      });
    }
  }

  // If HRRR didn't provide enough hours, or wasn't available, use GFS
  if (hourlyData.length < 48 && gfsData?.hourly) {
    const { time, temperature_2m, snowfall, windspeed_10m, winddirection_10m, precipitation } = gfsData.hourly;
    const startIndex = hourlyData.length; // Continue from where HRRR left off
    const hoursToTake = Math.min(240, time?.length || 0);

    for (let i = startIndex; i < hoursToTake; i++) {
      const temp = temperature_2m?.[i] || 30;
      const snow = snowfall?.[i] || 0;
      const precip = precipitation?.[i] || 0;

      // Estimate cloud cover
      let cloudCover = 50;
      if (snow > 0.1 || precip > 0.05) {
        cloudCover = Math.min(90, 70 + (snow + precip) * 15);
      } else if (temp < 32) {
        cloudCover = 35;
      }

      hourlyData.push({
        time: time[i],
        temp: Math.round(temp),
        windSpeed: Math.round(windspeed_10m?.[i] || 0),
        snowAccumulation: Math.round((snow || 0) * 10) / 10,
        weatherDescription: getWeatherDescription(snow || 0, temp),
        weatherIcon: getWeatherIcon(snow || 0, temp),
        cloudCover: Math.round(cloudCover),
        precipitation: precip || 0,
      });
    }
  }

  // Return up to 240 hours (10 days)
  return hourlyData.slice(0, 240);
}
