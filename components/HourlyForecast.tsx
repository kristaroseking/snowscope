"use client";

import { HourlyForecast as HourlyForecastType } from "@/types";

interface HourlyForecastProps {
  hourlyData: HourlyForecastType[];
  elevation: "base" | "mid" | "summit";
  selectedDayIndex?: number;
  targetDate?: string; // ISO date string from forecast
}

interface HourBlock {
  hour: string;
  time: string;
  temp: number;
  windSpeed: number;
  snowAccumulation: number;
  cloudCover: number;
  isDaytime: boolean;
}

export default function HourlyForecast({ hourlyData, elevation, selectedDayIndex = 0, targetDate: targetDateProp }: HourlyForecastProps) {
  const hourBlocks: HourBlock[] = [];

  // Use provided target date if available, otherwise calculate from index
  const targetDate = targetDateProp
    ? new Date(targetDateProp)
    : (() => {
        const now = new Date();
        const calculatedDate = new Date(now);
        calculatedDate.setDate(now.getDate() + selectedDayIndex);
        return calculatedDate;
      })();

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
        temp: Math.round(matchingHour.temp),
        windSpeed: Math.round(matchingHour.windSpeed),
        snowAccumulation: matchingHour.snowAccumulation,
        cloudCover: Math.round(matchingHour.cloudCover),
        isDaytime,
      });
    }
  }

  const dateLabel = targetDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <div className="bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        {dateLabel}
      </h3>

      {/* Horizontal scrolling container */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2" style={{ minWidth: "max-content" }}>
          {hourBlocks.map((hourBlock, index) => {
            // Cloud cover interpretation
            let skyEmoji = "";
            if (hourBlock.cloudCover < 20) {
              skyEmoji = hourBlock.isDaytime ? "☀️" : "🌙";
            } else if (hourBlock.cloudCover < 50) {
              skyEmoji = hourBlock.isDaytime ? "⛅" : "☁️";
            } else if (hourBlock.cloudCover < 80) {
              skyEmoji = "☁️";
            } else {
              skyEmoji = "☁️";
            }

            // Snow accumulation color
            let snowColor = "text-slate-400";
            if (hourBlock.snowAccumulation >= 0.5) {
              snowColor = "text-teal-light";
            } else if (hourBlock.snowAccumulation >= 0.2) {
              snowColor = "text-royal-light";
            } else if (hourBlock.snowAccumulation > 0) {
              snowColor = "text-purple-light";
            }

            // Wind intensity color
            let windColor = "text-slate-300";
            if (hourBlock.windSpeed > 30) {
              windColor = "text-red-400";
            } else if (hourBlock.windSpeed > 20) {
              windColor = "text-yellow-400";
            } else if (hourBlock.windSpeed > 10) {
              windColor = "text-slate-300";
            } else {
              windColor = "text-green-400";
            }

            return (
              <div
                key={index}
                className="bg-slate-750 rounded-lg p-3 border border-slate-600 hover:bg-slate-700 transition-colors flex-shrink-0"
                style={{ width: "90px" }}
              >
                {/* Hour */}
                <div className="text-center mb-2">
                  <div className="text-xs font-bold text-slate-200">
                    {hourBlock.hour}
                  </div>
                </div>

                {/* Sky Condition */}
                <div className="text-center mb-2">
                  <div className="text-2xl">{skyEmoji}</div>
                </div>

                {/* Temperature */}
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-white tabular-nums">
                    {hourBlock.temp}°
                  </div>
                </div>

                {/* Snow Accumulation */}
                {hourBlock.snowAccumulation > 0 && (
                  <div className="text-center mb-2">
                    <div className={`text-xs font-bold tabular-nums ${snowColor}`}>
                      {hourBlock.snowAccumulation >= 0.1
                        ? `${hourBlock.snowAccumulation.toFixed(1)}"`
                        : ""}
                    </div>
                  </div>
                )}

                {/* Wind Speed */}
                <div className="text-center border-t border-slate-600 pt-2">
                  <div className={`text-xs font-semibold tabular-nums ${windColor}`}>
                    {hourBlock.windSpeed} mph
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
