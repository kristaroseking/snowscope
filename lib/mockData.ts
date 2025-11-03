import { CurrentConditions, DailyForecast, ElevationConditions, ElevationForecast, HourlyForecast, ElevationHourlyForecast, ResortWeather } from "@/types";
import { RESORTS } from "./resorts";

function generateMockCurrentConditions(elevation: number): CurrentConditions {
  // Temperature decreases with elevation (roughly 3.5°F per 1000ft)
  const baseTemp = 28;
  const tempAdjustment = ((elevation - 7000) / 1000) * -3.5;

  return {
    temp: Math.round(baseTemp + tempAdjustment),
    feelsLike: Math.round(baseTemp + tempAdjustment - 5),
    windSpeed: Math.round(15 + Math.random() * 15),
    windDirection: Math.round(Math.random() * 360),
    humidity: Math.round(70 + Math.random() * 20),
    visibility: Math.round(5 + Math.random() * 5),
    snowfall24h: Math.round(Math.random() * 8),
    snowfall48h: Math.round(Math.random() * 15),
    weatherDescription: "Light Snow",
    weatherIcon: "13d",
    timestamp: Date.now(),
  };
}

function generateMockDailyForecast(elevation: number, daysAhead: number): DailyForecast {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  const baseTemp = 30;
  const tempAdjustment = ((elevation - 7000) / 1000) * -3.5;

  return {
    date: date.toISOString().split("T")[0],
    tempHigh: Math.round(baseTemp + tempAdjustment + Math.random() * 5),
    tempLow: Math.round(baseTemp + tempAdjustment - 10 + Math.random() * 5),
    snowAccumulation: Math.round(Math.random() * 10),
    windSpeed: Math.round(10 + Math.random() * 20),
    weatherDescription: Math.random() > 0.5 ? "Snow" : "Partly Cloudy",
    weatherIcon: Math.random() > 0.5 ? "13d" : "02d",
  };
}

function generateMockElevationConditions(elevations: { base: number; mid: number; summit: number }): ElevationConditions {
  return {
    base: generateMockCurrentConditions(elevations.base),
    mid: generateMockCurrentConditions(elevations.mid),
    summit: generateMockCurrentConditions(elevations.summit),
  };
}

function generateMockHourlyForecast(elevation: number, hoursAhead: number): HourlyForecast {
  const date = new Date();
  date.setHours(date.getHours() + hoursAhead);

  const baseTemp = 30;
  const tempAdjustment = ((elevation - 7000) / 1000) * -3.5;

  // Add some hourly variation
  const hourlyTempVariation = Math.sin(hoursAhead / 4) * 3;

  return {
    time: date.toISOString(),
    temp: Math.round(baseTemp + tempAdjustment + hourlyTempVariation),
    windSpeed: Math.round(10 + Math.random() * 20 + Math.sin(hoursAhead / 3) * 10),
    snowAccumulation: Math.random() > 0.7 ? Math.random() * 0.5 : 0,
    weatherDescription: Math.random() > 0.5 ? "Snow" : "Partly Cloudy",
    weatherIcon: Math.random() > 0.5 ? "13d" : "02d",
    cloudCover: Math.round(30 + Math.random() * 50),
    precipitation: Math.random() * 2,
  };
}

function generateMockElevationHourlyForecast(elevations: { base: number; mid: number; summit: number }): ElevationHourlyForecast {
  return {
    base: Array.from({ length: 240 }, (_, i) => generateMockHourlyForecast(elevations.base, i)),
    mid: Array.from({ length: 240 }, (_, i) => generateMockHourlyForecast(elevations.mid, i)),
    summit: Array.from({ length: 240 }, (_, i) => generateMockHourlyForecast(elevations.summit, i)),
  };
}

function generateMockElevationForecast(elevations: { base: number; mid: number; summit: number }): ElevationForecast {
  return {
    base: Array.from({ length: 7 }, (_, i) => generateMockDailyForecast(elevations.base, i)),
    mid: Array.from({ length: 7 }, (_, i) => generateMockDailyForecast(elevations.mid, i)),
    summit: Array.from({ length: 7 }, (_, i) => generateMockDailyForecast(elevations.summit, i)),
  };
}

export function generateMockResortWeather(resortId: string): ResortWeather | null {
  const resort = RESORTS.find((r) => r.id === resortId);

  if (!resort) {
    return null;
  }

  return {
    resort,
    current: generateMockElevationConditions(resort.elevations),
    forecast: generateMockElevationForecast(resort.elevations),
    hourly: generateMockElevationHourlyForecast(resort.elevations),
    lastUpdated: Date.now(),
  };
}

export function generateAllMockResortWeather(): ResortWeather[] {
  return RESORTS.map((resort) => ({
    resort,
    current: generateMockElevationConditions(resort.elevations),
    forecast: generateMockElevationForecast(resort.elevations),
    hourly: generateMockElevationHourlyForecast(resort.elevations),
    lastUpdated: Date.now(),
  }));
}
