// NOAA Weather API integration
// Uses the free weather.gov API (no key required!)

export interface NOAAForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface NOAAGridpoint {
  gridId: string;
  gridX: number;
  gridY: number;
}

/**
 * Get NOAA gridpoint coordinates from lat/lon
 * Required first step before getting forecasts
 */
export async function getNOAAGridpoint(
  latitude: number,
  longitude: number
): Promise<NOAAGridpoint | null> {
  try {
    const url = `https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SnowlineWeatherApp/1.0", // NOAA requires a User-Agent
      },
    });

    if (!response.ok) {
      console.error("NOAA gridpoint error:", response.status);
      return null;
    }

    const data = await response.json();

    return {
      gridId: data.properties.gridId,
      gridX: data.properties.gridX,
      gridY: data.properties.gridY,
    };
  } catch (error) {
    console.error("Error fetching NOAA gridpoint:", error);
    return null;
  }
}

/**
 * Get NOAA forecast for a gridpoint
 */
export async function getNOAAForecast(
  gridpoint: NOAAGridpoint
): Promise<NOAAForecastPeriod[] | null> {
  try {
    const url = `https://api.weather.gov/gridpoints/${gridpoint.gridId}/${gridpoint.gridX},${gridpoint.gridY}/forecast`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SnowlineWeatherApp/1.0",
      },
    });

    if (!response.ok) {
      console.error("NOAA forecast error:", response.status);
      return null;
    }

    const data = await response.json();
    return data.properties.periods;
  } catch (error) {
    console.error("Error fetching NOAA forecast:", error);
    return null;
  }
}

/**
 * Get NOAA gridded forecast data (includes hourly and more detailed info)
 */
export async function getNOAAGridData(
  gridpoint: NOAAGridpoint
): Promise<any | null> {
  try {
    const url = `https://api.weather.gov/gridpoints/${gridpoint.gridId}/${gridpoint.gridX},${gridpoint.gridY}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SnowlineWeatherApp/1.0",
      },
    });

    if (!response.ok) {
      console.error("NOAA grid data error:", response.status);
      return null;
    }

    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.error("Error fetching NOAA grid data:", error);
    return null;
  }
}

/**
 * Get current observations from nearest NOAA station
 */
export async function getNOAAObservation(
  stationId: string
): Promise<any | null> {
  try {
    const url = `https://api.weather.gov/stations/${stationId}/observations/latest`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SnowlineWeatherApp/1.0",
      },
    });

    if (!response.ok) {
      console.error("NOAA observation error:", response.status);
      return null;
    }

    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.error("Error fetching NOAA observation:", error);
    return null;
  }
}

/**
 * Find nearest NOAA observation stations for a location
 */
export async function findNearestNOAAStations(
  latitude: number,
  longitude: number
): Promise<string[] | null> {
  try {
    const url = `https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(4)}/stations`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SnowlineWeatherApp/1.0",
      },
    });

    if (!response.ok) {
      console.error("NOAA stations error:", response.status);
      return null;
    }

    const data = await response.json();
    return data.features.map((station: any) => station.properties.stationIdentifier);
  } catch (error) {
    console.error("Error finding NOAA stations:", error);
    return null;
  }
}
