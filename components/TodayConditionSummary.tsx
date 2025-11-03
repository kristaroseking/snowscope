"use client";

import { useState } from "react";
import { CurrentConditions, HourlyForecast, DailyForecast } from "@/types";
import HourlyRatingBar from "./HourlyRatingBar";
import TotalDaySnowfall from "./TotalDaySnowfall";
import HourlyNewSnowCard from "./HourlyNewSnowCard";

interface TodayConditionSummaryProps {
  elevation: "base" | "mid" | "summit";
  conditions: CurrentConditions;
  hourlyData?: HourlyForecast[];
  selectedDayIndex?: number;
  forecastDay?: DailyForecast;
  latitude?: number;
  longitude?: number;
  selectedHourIndex?: number | null;
  onHourIndexChange?: (index: number | null) => void;
}

interface HourData {
  hour: number;
  time: string;
  temp: number;
  windSpeed: number;
  windDirection?: number;
  snowAccumulation: number;
  score: number;
  rating: string;
  weatherDescription: string;
}

interface PeriodScore {
  score: number;
  rating: string;
}

export default function TodayConditionSummary({ elevation, conditions, hourlyData, selectedDayIndex = 0, forecastDay, latitude, longitude, selectedHourIndex, onHourIndexChange }: TodayConditionSummaryProps) {
  const [hoveredHour, setHoveredHour] = useState<HourData | null>(null);

  // Use forecast day data if available, otherwise use current conditions
  const isToday = selectedDayIndex === 0;
  const daySnowfall = isToday
    ? (hourlyData ? hourlyData.slice(0, 24).reduce((sum, hour) => sum + hour.snowAccumulation, 0) : conditions.snowfall24h)
    : (forecastDay?.snowAccumulation || 0);
  const dayWindSpeed = isToday ? conditions.windSpeed : (forecastDay?.windSpeed || 0);
  const dayTemp = isToday ? conditions.temp : (forecastDay ? (forecastDay.tempHigh + forecastDay.tempLow) / 2 : conditions.temp);


  // Calculate lift comfort rating based on wind speed
  const getLiftComfortRating = (windSpeed: number) => {
    if (windSpeed <= 5) return { rating: "EXCELLENT", color: "bg-emerald-500", textColor: "text-emerald-100" };
    if (windSpeed <= 10) return { rating: "GOOD", color: "bg-green-500", textColor: "text-green-100" };
    if (windSpeed <= 15) return { rating: "FAIR", color: "bg-lime-400", textColor: "text-lime-900" };
    if (windSpeed <= 20) return { rating: "POOR", color: "bg-orange-400", textColor: "text-orange-900" };
    return { rating: "HORRIBLE", color: "bg-red-500", textColor: "text-red-100" };
  };

  const liftComfort = getLiftComfortRating(dayWindSpeed);

  // Get date for header
  const dateLabel = forecastDay
    ? new Date(forecastDay.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="space-y-6 mb-6">
      {/* Hourly Rating Bar */}
      {hourlyData && hourlyData.length > 0 && (
        <HourlyRatingBar
          hourlyData={hourlyData}
          conditions={conditions}
          targetDate={forecastDay?.date}
          onHoverHour={setHoveredHour}
          latitude={latitude}
          longitude={longitude}
          selectedHourIndex={selectedHourIndex}
          onHourIndexChange={onHourIndexChange}
        />
      )}

      {/* New Snow Display and Hourly Card */}
      {hourlyData && hourlyData.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Total Day Snowfall - Takes up left half */}
          <div className="flex items-center justify-start py-12">
            <TotalDaySnowfall
              hourData={hoveredHour}
              allHourlyData={hourlyData.map((h, i) => ({
                hour: i,
                time: new Date(h.time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
                temp: Math.round(h.temp),
                windSpeed: Math.round(h.windSpeed),
                windDirection: h.windDirection,
                snowAccumulation: h.snowAccumulation,
                score: 50,
                rating: "FAIR",
                weatherDescription: h.weatherDescription
              }))}
            />
          </div>

          {/* Right: Hourly Snowfall Card - Takes up right half */}
          <div>
            <HourlyNewSnowCard hourData={hoveredHour} />
          </div>
        </div>
      )}
    </div>
  );
}
