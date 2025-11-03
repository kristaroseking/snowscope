"use client";

import { HourlyForecast } from "@/types";

interface SnowAccumulationDisplayProps {
  hourlyData: HourlyForecast[];
  targetDate?: string;
  selectedHourIndex?: number | null;
  onHourIndexChange?: (index: number | null) => void;
}

interface HourBlock {
  hour: string;
  time: string;
  snowAccumulation: number;
  isDaytime: boolean;
}

export default function SnowAccumulationDisplay({ hourlyData, targetDate: targetDateProp }: SnowAccumulationDisplayProps) {
  const hourBlocks: HourBlock[] = [];

  // Use provided target date if available, otherwise use today
  const targetDate = targetDateProp
    ? new Date(targetDateProp)
    : new Date();

  // Set to midnight of the target day
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Get target date string for comparison (YYYY-MM-DD)
  const targetDateString = targetDate.toISOString().split('T')[0];

  // Filter hourly data to get all hours from midnight to midnight
  const dayHours = hourlyData.filter(hour => {
    const hourTime = new Date(hour.time);
    const hourDateString = hourTime.toISOString().split('T')[0];
    return hourDateString === targetDateString;
  });

  // Create a block for each hour from 12am to 11pm
  for (let hour = 0; hour < 24; hour++) {
    // Find the matching hour in the data (already filtered to correct day)
    const matchingHour = dayHours.find(h => {
      const hTime = new Date(h.time);
      return hTime.getHours() === hour;
    });

    if (matchingHour) {
      const hourTime = new Date(matchingHour.time);
      const isDaytime = hour >= 6 && hour < 18;

      // Format hour label (12am, 1am, 2am, etc.)
      const hourLabel = hour === 0 ? "12am" :
                       hour < 12 ? `${hour}am` :
                       hour === 12 ? "12pm" :
                       `${hour - 12}pm`;

      hourBlocks.push({
        hour: hourLabel,
        time: hourTime.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        snowAccumulation: matchingHour.snowAccumulation,
        isDaytime,
      });
    }
  }

  const dateLabel = targetDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  // Calculate total snow for the day
  const totalSnow = hourBlocks.reduce((sum, block) => sum + block.snowAccumulation, 0);

  return (
    <div className="bg-slate-800 rounded-card shadow-sm p-4 sm:p-6 border border-slate-700 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Snow Accumulation - {dateLabel}
        </h3>
        <div className="text-sm sm:text-base text-slate-300">
          Total: <span className="font-bold text-teal-light">{totalSnow.toFixed(1)}"</span>
        </div>
      </div>

      {/* Horizontal scrolling container */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2" style={{ minWidth: "max-content" }}>
          {hourBlocks.map((hourBlock, index) => {
            // Determine snow emoji based on accumulation
            let snowEmoji = "";
            if (hourBlock.snowAccumulation > 1.5) {
              snowEmoji = "❄️❄️"; // Heavy snow
            } else if (hourBlock.snowAccumulation > 0.5) {
              snowEmoji = "🌨️"; // Moderate snow
            } else if (hourBlock.snowAccumulation > 0.1) {
              snowEmoji = "🌨"; // Light snow
            } else if (hourBlock.isDaytime) {
              snowEmoji = "☀️"; // No snow, daytime
            } else {
              snowEmoji = "🌙"; // No snow, nighttime
            }

            return (
              <div
                key={index}
                className={`flex flex-col items-center p-3 rounded-lg min-w-[80px] ${
                  hourBlock.isDaytime ? "bg-slate-700" : "bg-slate-750"
                }`}
              >
                {/* Hour */}
                <div className="text-xs text-slate-400 mb-2 font-medium">
                  {hourBlock.hour}
                </div>

                {/* Snow emoji */}
                <div className="text-2xl mb-2">
                  {snowEmoji}
                </div>

                {/* Snow accumulation */}
                <div className="text-lg font-bold text-teal-light tabular-nums">
                  {hourBlock.snowAccumulation > 0 ? hourBlock.snowAccumulation.toFixed(1) : "0"}"
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
