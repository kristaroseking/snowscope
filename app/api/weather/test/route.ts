import { NextResponse } from "next/server";
import { RESORTS } from "@/lib/resorts";
import { aggregateWeatherData } from "@/lib/services/weatherAggregator";

/**
 * Test endpoint to verify real weather data integration
 * GET /api/weather/test
 */
export async function GET() {
  try {
    // Test with Stowe as example
    const stowe = RESORTS.find((r) => r.id === "stowe");

    if (!stowe) {
      return NextResponse.json(
        { success: false, error: "Resort not found" },
        { status: 404 }
      );
    }

    console.log("Testing weather data aggregation for Stowe...");

    // Fetch aggregated data from all available sources
    const weatherData = await aggregateWeatherData(stowe);

    return NextResponse.json({
      success: true,
      resort: stowe.name,
      data: weatherData,
      message: "Weather data aggregated successfully from: " +
        weatherData.metadata.sourcesUsed.join(", "),
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
