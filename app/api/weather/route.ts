import { NextResponse } from "next/server";
import { RESORTS } from "@/lib/resorts";
import { getResortWeatherData } from "@/lib/weatherDataConverter";
import { weatherCache } from "@/lib/cache";

export async function GET() {
  try {
    const cacheKey = "all-resorts-weather";

    // Check cache first
    const cachedData = weatherCache.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached weather data for all resorts");
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
      });
    }

    // Fetch real weather data for all resorts
    console.log("Fetching fresh weather data for all resorts...");

    const weatherDataPromises = RESORTS.map((resort) =>
      getResortWeatherData(resort).catch((error) => {
        console.error(`Error fetching data for ${resort.name}:`, error);
        return null;
      })
    );

    const weatherData = (await Promise.all(weatherDataPromises)).filter(
      (data) => data !== null
    );

    // Cache for 10 minutes
    weatherCache.set(cacheKey, weatherData);

    return NextResponse.json({
      success: true,
      data: weatherData,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch weather data",
      },
      { status: 500 }
    );
  }
}
