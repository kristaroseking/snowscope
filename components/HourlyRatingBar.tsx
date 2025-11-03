"use client";

import { useState, useEffect, useRef } from "react";
import { HourlyForecast, CurrentConditions } from "@/types";
import { getSunriseSunset, getDayNightOpacity } from "@/lib/utils/sunriseSunset";

interface HourlyRatingBarProps {
  hourlyData: HourlyForecast[];
  conditions: CurrentConditions;
  targetDate?: string;
  onHoverHour?: (hour: HourData | null) => void;
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

export default function HourlyRatingBar({ hourlyData, conditions, targetDate, onHoverHour, latitude = 44.5305, longitude = -72.7817, selectedHourIndex, onHourIndexChange }: HourlyRatingBarProps) {
  const [hourlyScores, setHourlyScores] = useState<HourData[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Use prop if provided, otherwise fall back to local state
  const selectedIndex = selectedHourIndex !== undefined ? selectedHourIndex : localSelectedIndex;

  // Helper to update selectedIndex
  const updateSelectedIndex = (index: number | null) => {
    if (onHourIndexChange) {
      onHourIndexChange(index);
    } else {
      setLocalSelectedIndex(index);
    }
  };

  // Filter hourly data for the target date
  const targetDateString = targetDate
    ? new Date(targetDate).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const dayHours = hourlyData.filter(hour => {
    const hourTime = new Date(hour.time);
    const hourDateString = hourTime.toISOString().split('T')[0];
    return hourDateString === targetDateString;
  });

  useEffect(() => {
    async function fetchHourlyScores() {
      setLoading(true);
      const baseDepth = conditions.snowDepth || 0;

      // Build batch request for all 24 hours
      const batchRequests: any[] = [];
      const hourMapping: any[] = [];

      for (let hourNum = 0; hourNum < 24; hourNum++) {
        const matchingHour = dayHours.find(h => {
          const hTime = new Date(h.time);
          return hTime.getHours() === hourNum;
        });

        if (matchingHour) {
          batchRequests.push({
            temperature: matchingHour.temp,
            feels_like: matchingHour.temp - 2,
            wind_speed: matchingHour.windSpeed,
            humidity: conditions.humidity || 65,
            precipitation: matchingHour.precipitation || 0,
            base_depth: baseDepth,
            new_snow_24h: matchingHour.snowAccumulation,
            snow_quality: matchingHour.snowAccumulation > 5 ? "blower powder" : "packed powder",
            surface_condition: "groomed"
          });

          hourMapping.push({
            hourNum,
            matchingHour
          });
        }
      }

      try {
        // Single batch API call for all hours
        const response = await fetch('/api/score/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchRequests)
        });

        const result = await response.json();
        const scores: HourData[] = [];

        if (result.success && result.data) {
          result.data.forEach((scoreData: any, index: number) => {
            const { hourNum, matchingHour } = hourMapping[index];
            const hourTime = new Date(matchingHour.time);

            scores.push({
              hour: hourNum,
              time: hourTime.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
              temp: Math.round(matchingHour.temp),
              windSpeed: Math.round(matchingHour.windSpeed),
              windDirection: matchingHour.windDirection,
              snowAccumulation: matchingHour.snowAccumulation,
              score: Math.round(scoreData.overall_score),
              rating: scoreData.rating,
              weatherDescription: matchingHour.weatherDescription
            });
          });
        } else {
          // Fallback if batch fails
          hourMapping.forEach(({ hourNum, matchingHour }) => {
            const hourTime = new Date(matchingHour.time);
            scores.push({
              hour: hourNum,
              time: hourTime.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
              temp: Math.round(matchingHour.temp),
              windSpeed: Math.round(matchingHour.windSpeed),
              windDirection: matchingHour.windDirection,
              snowAccumulation: matchingHour.snowAccumulation,
              score: 50,
              rating: "FAIR",
              weatherDescription: matchingHour.weatherDescription
            });
          });
        }

        setHourlyScores(scores);
        setLoading(false);

        // Set default to current hour if viewing today (only if no external control)
        if (selectedHourIndex === undefined) {
          const today = new Date().toISOString().split('T')[0];
          if (targetDateString === today) {
            const currentHour = new Date().getHours();
            const currentIndex = scores.findIndex(s => s.hour === currentHour);
            if (currentIndex !== -1) {
              updateSelectedIndex(currentIndex);
              if (onHoverHour) {
                onHoverHour(scores[currentIndex]);
              }
            }
          } else if (scores.length > 0) {
            // Default to first hour for other days
            updateSelectedIndex(0);
            if (onHoverHour) {
              onHoverHour(scores[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching batch hour scores:', error);
        setLoading(false);
      }
    }

    if (dayHours.length > 0) {
      fetchHourlyScores();
    }
  }, [hourlyData, targetDate, conditions]);

  const getScoreColor = (score: number, rating?: string) => {
    if (rating === "GO_SURFING") return "bg-gray-500";
    if (score >= 80) return "bg-emerald-500";
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-lime-400";
    if (score >= 30) return "bg-orange-400";
    return "bg-red-500";
  };

  const getTextColor = (score: number, rating?: string) => {
    if (rating === "GO_SURFING") return "text-gray-500";
    if (score >= 80) return "text-emerald-500";
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-lime-400";
    if (score >= 30) return "text-orange-400";
    return "text-red-500";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || hourlyScores.length === 0) return;

    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    // Round to nearest hour segment to keep indicator centered
    const index = Math.round(percentage * hourlyScores.length - 0.5);
    const clampedIndex = Math.max(0, Math.min(hourlyScores.length - 1, index));

    updateSelectedIndex(clampedIndex);
    if (onHoverHour) {
      onHoverHour(hourlyScores[clampedIndex]);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  if (loading) {
    return (
      <div className="w-full h-24 bg-slate-600 rounded-lg animate-pulse"></div>
    );
  }

  // Calculate indicator position to center on each hour segment
  const indicatorPosition = selectedIndex !== null
    ? ((selectedIndex + 0.5) / hourlyScores.length) * 100
    : 0;

  const selectedHour = selectedIndex !== null ? hourlyScores[selectedIndex] : null;

  // Get sunrise/sunset times for the location
  const targetDateObj = targetDate ? new Date(targetDate) : new Date();
  const sunTimes = getSunriseSunset(latitude, longitude, targetDateObj);

  return (
    <div className="w-full">
      {/* Rating on left above card - on site background */}
      {selectedHour && (
        <div className="mb-4 px-2">
          <div className={`text-3xl font-bold ${getTextColor(selectedHour.score, selectedHour.rating)}`}>
            {(() => {
              if (selectedHour.rating === "GO_SURFING") return "GO SURFING";
              // Override rating text based on score to match colors
              if (selectedHour.score >= 80) return "EPIC";
              if (selectedHour.score >= 70) return "EXCELLENT";
              if (selectedHour.score >= 50) return "GOOD";
              if (selectedHour.score >= 30) return "FAIR";
              return "POOR";
            })()}
          </div>
        </div>
      )}

      {/* Scorecard with day/night shading around (not on) the bar */}
      <div className="relative bg-slate-800 rounded-card shadow-lg border border-slate-700 py-12 px-6 mb-3">
        {/* Day/night shading background - behind the colored bar */}
        <div className="absolute inset-0 flex rounded-card overflow-hidden pointer-events-none">
          {hourlyScores.map((hourData, index) => {
            const opacity = getDayNightOpacity(hourData.hour, sunTimes);
            return (
              <div
                key={`shade-bg-${index}`}
                className="flex-1"
                style={{
                  minWidth: `${100 / hourlyScores.length}%`,
                  backgroundColor: `rgba(71, 85, 105, ${opacity})` // slate-600
                }}
              />
            );
          })}
        </div>

        {/* Rating bar with indicator */}
        <div className="relative">
          <div
            ref={barRef}
            className="flex h-20 rounded-lg overflow-hidden cursor-pointer relative"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              // Don't clear selection on mouse leave - persist last position
            }}
          >
            {/* Color rating bars */}
            {hourlyScores.map((hourData, index) => (
              <div
                key={index}
                className={`flex-1 ${getScoreColor(hourData.score, hourData.rating)}`}
                style={{ minWidth: `${100 / hourlyScores.length}%` }}
              />
            ))}
          </div>
        </div>

        {/* Draggable white indicator line - full card height with z-index */}
        {selectedIndex !== null && hourlyScores[selectedIndex] && (
          <div
            className="absolute w-1 bg-white shadow-lg pointer-events-none top-0 bottom-0 z-10"
            style={{
              left: `${indicatorPosition}%`,
              transform: 'translateX(-50%)'
            }}
          />
        )}

        {/* Time display above white line */}
        {selectedIndex !== null && hourlyScores[selectedIndex] && (
          <div
            className="absolute transform -translate-x-1/2 pointer-events-none z-20"
            style={{
              left: `${indicatorPosition}%`,
              top: '-20px'
            }}
          >
            <div className="text-sm font-semibold text-white whitespace-nowrap">
              {(() => {
                const hour = hourlyScores[selectedIndex].hour;
                const period = hour >= 12 ? 'pm' : 'am';
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                return `${displayHour}:00${period}`;
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Hour labels every 3 hours - outside scorecard, aligned with color bar */}
      <div className="flex relative h-6">
        {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
          // Find the index of this hour in hourlyScores
          const hourIndex = hourlyScores.findIndex(h => h.hour === hour);
          if (hourIndex === -1) return null; // Skip if hour not found

          // Calculate position based on the center of this hour's segment
          const position = ((hourIndex + 0.5) / hourlyScores.length) * 100;
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return (
            <div
              key={hour}
              className="absolute text-center transform -translate-x-1/2"
              style={{ left: `${position}%` }}
            >
              <span className="text-sm text-slate-400 font-medium">
                {displayHour}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
