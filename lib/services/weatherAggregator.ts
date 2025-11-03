// Weather data aggregator - combines multiple sources into unified format

import { Resort } from "@/types";
import { WeatherSourceConfig } from "../weatherSources";
import { fetchWundergroundStation } from "./wunderground";
import { getNOAAGridpoint, getNOAAForecast, getNOAAGridData } from "./noaa";
import { fetchGFSModelData, fetchHRRRModelData, fetchHistoricalSnowfall } from "./pivotalWeather";
import { fetchRFCSnowData, getRFCRegionForLocation } from "./nwsRfc";

export interface AggregatedWeatherData {
  sources: {
    wunderground?: any;
    noaa?: any;
    gfs?: any;
    hrrr?: any;
    rfc?: any;
  };
  combined: {
    current: {
      temp: number;
      windSpeed: number;
      snowfall24h?: number;
      snowDepth?: number;
      humidity?: number;
    };
    forecast: Array<{
      date: string;
      tempHigh: number;
      tempLow: number;
      snowAccumulation: number;
      windSpeed: number;
    }>;
  };
  metadata: {
    lastUpdated: number;
    sourcesUsed: string[];
  };
}

/**
 * Fetch and aggregate weather data from multiple sources
 */
export async function aggregateWeatherData(
  resort: Resort,
  config?: WeatherSourceConfig
): Promise<AggregatedWeatherData> {
  const sources: AggregatedWeatherData["sources"] = {};
  const sourcesUsed: string[] = [];

  try {
    // 1. Fetch NOAA data (always available, free)
    console.log(`Fetching NOAA data for ${resort.name}...`);
    const noaaGridpoint = await getNOAAGridpoint(
      resort.latitude,
      resort.longitude
    );

    if (noaaGridpoint) {
      const [forecast, gridData] = await Promise.all([
        getNOAAForecast(noaaGridpoint),
        getNOAAGridData(noaaGridpoint),
      ]);

      sources.noaa = { forecast, gridData };
      sourcesUsed.push("NOAA");
    }

    // 2. Fetch GFS model data (via Open-Meteo, free)
    console.log(`Fetching GFS model data for ${resort.name}...`);
    const gfsData = await fetchGFSModelData(
      resort.latitude,
      resort.longitude
    );

    if (gfsData) {
      sources.gfs = gfsData;
      sourcesUsed.push("GFS Model");
    }

    // 3. Fetch HRRR data for short-term accuracy
    console.log(`Fetching HRRR model data for ${resort.name}...`);
    const hrrrData = await fetchHRRRModelData(
      resort.latitude,
      resort.longitude
    );

    if (hrrrData) {
      sources.hrrr = hrrrData;
      sourcesUsed.push("HRRR Model");
    }

    // 4. Fetch Weather Underground station data (if configured)
    if (config?.wunderground?.stationId) {
      console.log(
        `Fetching Wunderground data for station ${config.wunderground.stationId}...`
      );
      const wuData = await fetchWundergroundStation(
        config.wunderground.stationId,
        config.wunderground.apiKey
      );

      if (wuData) {
        sources.wunderground = wuData;
        sourcesUsed.push("Weather Underground");
      }
    }

    // 5. Fetch RFC snow data (if available for region)
    const rfcRegion = getRFCRegionForLocation(
      resort.latitude,
      resort.longitude
    );
    console.log(`Fetching RFC data from ${rfcRegion}...`);
    const rfcData = await fetchRFCSnowData(rfcRegion);

    if (rfcData) {
      sources.rfc = rfcData;
      sourcesUsed.push("NWS RFC");
    }

    // Combine data from all sources
    const combined = await combineWeatherSources(sources, resort);

    return {
      sources,
      combined,
      metadata: {
        lastUpdated: Date.now(),
        sourcesUsed,
      },
    };
  } catch (error) {
    console.error("Error aggregating weather data:", error);

    // Return empty data structure on error
    return {
      sources: {},
      combined: {
        current: {
          temp: 0,
          windSpeed: 0,
        },
        forecast: [],
      },
      metadata: {
        lastUpdated: Date.now(),
        sourcesUsed: [],
      },
    };
  }
}

/**
 * Combine data from multiple sources with priority weighting
 * Priority: Wunderground (most local) > HRRR > GFS > NOAA > RFC
 */
async function combineWeatherSources(sources: AggregatedWeatherData["sources"], resort: Resort) {
  const combined = {
    current: {
      temp: 0,
      windSpeed: 0,
      snowfall24h: 0,
      snowDepth: undefined as number | undefined,
      humidity: undefined as number | undefined,
    },
    forecast: [] as Array<{
      date: string;
      tempHigh: number;
      tempLow: number;
      snowAccumulation: number;
      windSpeed: number;
    }>,
  };

  // Extract current conditions
  if (sources.wunderground) {
    combined.current.temp = sources.wunderground.temp;
    combined.current.windSpeed = sources.wunderground.windSpeed;
    combined.current.humidity = sources.wunderground.humidity;
    combined.current.snowDepth = sources.wunderground.snowDepth;
  } else if (sources.hrrr?.hourly) {
    // Use most recent HRRR data
    combined.current.temp = sources.hrrr.hourly.temperature_2m[0];
    combined.current.windSpeed = sources.hrrr.hourly.windspeed_10m[0];
  } else if (sources.gfs?.hourly) {
    // Fallback to GFS
    combined.current.temp = sources.gfs.hourly.temperature_2m[0];
    combined.current.windSpeed = sources.gfs.hourly.windspeed_10m[0];
  }

  // Calculate estimated base depth from historical snowfall data if not available from Weather Underground
  // Fetch real historical snowfall from the past 30 days
  if (!combined.current.snowDepth) {
    try {
      const historicalData = await fetchHistoricalSnowfall(resort.latitude, resort.longitude);

      if (historicalData?.daily?.snowfall_sum) {
        let estimatedDepth = 0;
        const snowfallArray = historicalData.daily.snowfall_sum;

        // Sum up the last 30 days of ACTUAL snowfall (not forecast)
        // Apply a decay factor since older snow compacts and melts
        for (let i = 0; i < snowfallArray.length; i++) {
          const daysAgo = snowfallArray.length - 1 - i; // Most recent day = 0 days ago
          const snowfall = snowfallArray[i] || 0;
          // Apply exponential decay: snow from today counts 100%, yesterday 95%, etc.
          const decayFactor = Math.pow(0.95, daysAgo);
          estimatedDepth += snowfall * decayFactor;
        }

        // Only set if we have some accumulated snow (> 5 inches)
        // This prevents showing "open" status when we have no real data
        if (estimatedDepth > 5) {
          combined.current.snowDepth = Math.round(estimatedDepth);
        }
        // If estimatedDepth <= 5, leave snowDepth as undefined
        // This will cause components to use 0, triggering "go surfing" appropriately
      }
    } catch (error) {
      console.error('Error calculating base depth from historical data:', error);
      // Leave snowDepth as undefined if historical data fetch fails
    }
  }

  // Extract 10-day forecast (primarily from GFS via Open-Meteo)
  if (sources.gfs?.daily) {
    const daily = sources.gfs.daily;
    for (let i = 0; i < 10 && i < daily.time.length; i++) {
      combined.forecast.push({
        date: daily.time[i],
        tempHigh: daily.temperature_2m_max[i],
        tempLow: daily.temperature_2m_min[i],
        snowAccumulation: daily.snowfall_sum[i] || 0,
        windSpeed: daily.windspeed_10m_max[i],
      });
    }
  }

  return combined;
}

/**
 * Get weather data for specific elevation
 * Applies lapse rate adjustment for temperature
 */
export function adjustForElevation(
  data: AggregatedWeatherData,
  baseElevation: number,
  targetElevation: number
): AggregatedWeatherData {
  const elevationDiff = targetElevation - baseElevation;
  const tempAdjustment = (elevationDiff / 1000) * -3.5; // ~3.5°F per 1000ft

  const adjusted = JSON.parse(JSON.stringify(data)); // Deep clone

  // Adjust current temp
  adjusted.combined.current.temp += tempAdjustment;

  // Adjust forecast temps
  adjusted.combined.forecast.forEach((day: any) => {
    day.tempHigh += tempAdjustment;
    day.tempLow += tempAdjustment;

    // Higher elevations typically get 10-20% more snow
    if (elevationDiff > 0) {
      day.snowAccumulation *= 1 + elevationDiff / 10000;
    }
  });

  return adjusted;
}
