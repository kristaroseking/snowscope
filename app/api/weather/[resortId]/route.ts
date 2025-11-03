import { NextResponse } from "next/server";
import { getResortById } from "@/lib/resorts";
import { getResortWeatherData } from "@/lib/weatherDataConverter";
import { weatherCache } from "@/lib/cache";

export async function GET(
  request: Request,
  { params }: { params: { resortId: string } }
) {
  try {
    const { resortId } = params;
    const resort = getResortById(resortId);

    if (!resort) {
      return NextResponse.json(
        {
          success: false,
          error: "Resort not found",
        },
        { status: 404 }
      );
    }

    const cacheKey = `resort-weather-${resortId}`;

    // Check cache first
    const cachedData = weatherCache.get(cacheKey);
    if (cachedData) {
      console.log(`Returning cached weather data for ${resort.name}`);
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
      });
    }

    // Fetch real weather data
    console.log(`Fetching fresh weather data for ${resort.name}...`);
    const weatherData = await getResortWeatherData(resort);

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
