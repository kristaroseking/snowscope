"use client";

import Link from "next/link";
import { ResortWeather } from "@/types";
import { useEffect, useState } from "react";

interface ResortForecastRowProps {
  weatherData: ResortWeather;
}

interface PeriodScore {
  score: number;
  rating: string;
}

export default function ResortForecastRow({ weatherData }: ResortForecastRowProps) {
  const { resort, forecast, current, hourly } = weatherData;
  const [allDayScores, setAllDayScores] = useState<PeriodScore[][]>([]);
  const [loading, setLoading] = useState(true);

  // Use mid-mountain forecast for display
  const forecastDays = forecast.mid;

  // Calculate today's total snowfall from hourly data if available
  const todaySnowfall = hourly?.mid
    ? hourly.mid.slice(0, 24).reduce((sum, hour) => sum + hour.snowAccumulation, 0)
    : forecastDays[0]?.snowAccumulation || 0;

  // Fetch scores for all days (morning, afternoon, evening periods for each day)
  useEffect(() => {
    async function fetchAllDayScores() {
      if (forecastDays.length === 0) {
        setLoading(false);
        return;
      }

      // Use real snow depth from current conditions, fallback to 0 if not available
      const baseDepth = current.mid.snowDepth || 0;

      // Fetch scores for all 10 days
      const allScoresPromises = forecastDays.map(async (day, dayIndex) => {
        const daySnowfall = dayIndex === 0 ? todaySnowfall : day.snowAccumulation;

        // Define three time periods for this day
        const periods = [
          { label: "Morning", temp: day.tempLow + 2, snow: daySnowfall * 0.3 },
          { label: "Afternoon", temp: day.tempHigh, snow: daySnowfall * 0.4 },
          { label: "Evening", temp: (day.tempHigh + day.tempLow) / 2, snow: daySnowfall * 0.3 }
        ];

        const scorePromises = periods.map(async (period) => {
          try {
            const response = await fetch('/api/score', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                temperature: period.temp,
                feels_like: period.temp - 2,
                wind_speed: day.windSpeed,
                humidity: 65,
                precipitation: 0,
                base_depth: baseDepth,
                new_snow_24h: period.snow,
                snow_quality: period.snow > 5 ? "blower powder" : "packed powder",
                surface_condition: "groomed"
              })
            });

            const result = await response.json();
            if (result.success && result.data) {
              return {
                score: Math.round(result.data.overall_score),
                rating: result.data.rating
              };
            }
            return { score: 50, rating: "FAIR" };
          } catch (error) {
            console.error('Error fetching period score:', error);
            return { score: 50, rating: "FAIR" };
          }
        });

        return Promise.all(scorePromises);
      });

      const allScores = await Promise.all(allScoresPromises);
      setAllDayScores(allScores);
      setLoading(false);
    }

    fetchAllDayScores();
  }, [forecastDays, todaySnowfall]);

  // Helper function to get color based on score or rating
  const getScoreColor = (score: number, rating?: string) => {
    if (rating === "GO_SURFING") return "bg-gray-500"; // GO SURFING
    if (score >= 80) return "bg-emerald-500"; // EXCELLENT
    if (score >= 70) return "bg-green-500";   // GOOD
    if (score >= 50) return "bg-lime-400";    // FAIR
    if (score >= 30) return "bg-orange-400";  // POOR
    return "bg-red-500";                       // BAD
  };

  // Helper function to convert snowfall to range format
  // 0.1 -> "0-1"", 1.4 -> "1-2"", 5.7 -> "5-6"", etc.
  const getSnowfallRange = (snow: number): string => {
    if (snow === 0) return "0\"";
    const lower = Math.floor(snow);
    const upper = lower + 1;
    return `${lower}-${upper}"`;
  };

  // Helper function to get weather description text from emoji
  const getWeatherText = (emoji: string): string => {
    const emojiMap: Record<string, string> = {
      "❄️❄️": "Heavy Snow",
      "🌨️": "Moderate Snow",
      "🌨": "Light Snow",
      "⛅": "Partly Cloudy",
      "☁️": "Cloudy",
    };
    return emojiMap[emoji] || "Cloudy";
  };

  return (
    <Link
      href={`/resort/${resort.id}`}
      className="block bg-slate-800 rounded-card shadow-lg border border-slate-700 p-4 sm:p-6 hover:bg-slate-750 hover:shadow-xl transition-all"
    >
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">{resort.name}</h3>
        <p className="text-xs sm:text-sm text-slate-400">{resort.state}, {resort.country}</p>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-3 sm:gap-2">
        {forecastDays.map((day, index) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

          return (
            <div
              key={index}
              className="flex flex-col items-center text-center border border-slate-600 rounded-lg p-3 sm:p-2 hover:bg-slate-700 transition-colors bg-slate-750"
            >
              <div className="text-xs font-medium text-slate-300 mb-2 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1">
                <span>{dayName}</span>
                <span className="text-slate-400 font-normal text-[10px] sm:text-xs">{date.getMonth() + 1}/{date.getDate()}</span>
              </div>
              <div className="text-xl sm:text-xl font-bold mb-2 sm:mb-1 tabular-nums text-teal-light">
                {getSnowfallRange(day.snowAccumulation)}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs mb-2 sm:mb-1 tabular-nums">
                <span className="text-slate-300">{Math.round((day.tempHigh + day.tempLow) / 2)}°</span>
                <span className="text-slate-400 text-[10px] sm:text-xs">{day.windSpeed} mph</span>
              </div>
              <div
                className="text-2xl mb-3 sm:mb-2 cursor-pointer relative group"
              >
                {day.weatherDescription}
                {/* Custom tooltip */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-slate-600">
                  {getWeatherText(day.weatherDescription)}
                </div>
              </div>
              {/* Three horizontal condition bars for all days */}
              <div className="w-full flex gap-0.5 mt-auto pt-2 border-t border-slate-600">
                {loading || !allDayScores[index] ? (
                  // Loading state: show grey bars
                  <>
                    <div className="flex-1 h-2 sm:h-1.5 rounded-full bg-slate-600 animate-pulse" title="Morning" />
                    <div className="flex-1 h-2 sm:h-1.5 rounded-full bg-slate-600 animate-pulse" title="Afternoon" />
                    <div className="flex-1 h-2 sm:h-1.5 rounded-full bg-slate-600 animate-pulse" title="Evening" />
                  </>
                ) : (
                  // Show actual scores for this day
                  allDayScores[index].map((period, periodIndex) => (
                    <div
                      key={periodIndex}
                      className={`flex-1 h-2 sm:h-1.5 rounded-full ${getScoreColor(period.score, period.rating)}`}
                      title={`${["Morning", "Afternoon", "Evening"][periodIndex]}: ${period.rating === "GO_SURFING" ? "Go Surfing" : period.rating}`}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Link>
  );
}
