// Weather Underground integration
// Note: WU deprecated their free API, so this uses web scraping or requires an enterprise key

export interface WundergroundStationData {
  stationId: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  dewpoint: number;
  snowDepth?: number;
  timestamp: number;
}

/**
 * Fetch data from a Weather Underground personal weather station
 * Note: This requires either:
 * 1. An enterprise API key (contact WU for pricing)
 * 2. Web scraping from wunderground.com/dashboard/pws/{stationId}
 *
 * For now, this is a stub that needs implementation based on your access method
 */
export async function fetchWundergroundStation(
  stationId: string,
  apiKey?: string
): Promise<WundergroundStationData | null> {
  try {
    if (apiKey) {
      // Using enterprise API (if available)
      // const url = `https://api.weather.com/v2/pws/observations/current?stationId=${stationId}&format=json&units=e&apiKey=${apiKey}`;
      // const response = await fetch(url);
      // const data = await response.json();
      // return parseWundergroundApiResponse(data);

      console.warn("Wunderground API integration requires enterprise key");
      return null;
    } else {
      // Web scraping approach would go here
      // This requires parsing HTML from wunderground.com/dashboard/pws/{stationId}
      // You might want to use a service like Puppeteer or Cheerio for this

      console.warn("Wunderground scraping not yet implemented");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Wunderground data:", error);
    return null;
  }
}

/**
 * Get historical data from Weather Underground (if available)
 */
export async function fetchWundergroundHistory(
  stationId: string,
  date: Date,
  apiKey?: string
): Promise<WundergroundStationData[] | null> {
  // Implementation would go here
  console.warn("Wunderground history not yet implemented");
  return null;
}
