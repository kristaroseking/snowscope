"use client";

import { useState, useEffect, useRef } from "react";
import { HourlyForecast } from "@/types";
import { getSunriseSunset, getDayNightOpacity, formatTimeString } from "@/lib/utils/sunriseSunset";

interface CombinedWindSnowDisplayProps {
  hourlyData: HourlyForecast[];
  targetDate?: string;
  latitude?: number;
  longitude?: number;
  selectedHourIndex?: number | null;
  onHourIndexChange?: (index: number | null) => void;
}

interface HourCombinedData {
  hour: number;
  time: string;
  temp: number;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  snowAccumulation: number;
}

export default function CombinedWindSnowDisplay({ hourlyData, targetDate, latitude = 44.5305, longitude = -72.7817, selectedHourIndex, onHourIndexChange }: CombinedWindSnowDisplayProps) {
  const [hourlyCombinedData, setHourlyCombinedData] = useState<HourCombinedData[]>([]);
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
    const combinedData: HourCombinedData[] = [];

    // Create all 24 hours from 12am to 11pm
    for (let hourNum = 0; hourNum < 24; hourNum++) {
      const matchingHour = dayHours.find(h => {
        const hTime = new Date(h.time);
        return hTime.getHours() === hourNum;
      });

      if (matchingHour) {
        const hourTime = new Date(matchingHour.time);
        const speed = Math.round(matchingHour.windSpeed);
        combinedData.push({
          hour: hourNum,
          time: hourTime.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
          temp: Math.round(matchingHour.temp),
          windSpeed: speed,
          windGust: Math.round(speed * 1.3),
          windDirection: matchingHour.windDirection || 0,
          snowAccumulation: matchingHour.snowAccumulation || 0
        });
      }
    }

    setHourlyCombinedData(combinedData);

    // Set default to current hour if viewing today (only if no external control)
    if (selectedHourIndex === undefined) {
      const today = new Date().toISOString().split('T')[0];
      if (targetDateString === today) {
        const currentHour = new Date().getHours();
        const currentIndex = combinedData.findIndex(w => w.hour === currentHour);
        if (currentIndex !== -1) {
          updateSelectedIndex(currentIndex);
        }
      } else if (combinedData.length > 0) {
        // Default to first hour for other days
        updateSelectedIndex(0);
      }
    }
  }, [hourlyData, targetDate]);

  const get8DirectionLabel = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || hourlyCombinedData.length === 0) return;

    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(percentage * hourlyCombinedData.length - 0.5);
    const clampedIndex = Math.max(0, Math.min(hourlyCombinedData.length - 1, index));

    updateSelectedIndex(clampedIndex);
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

  if (hourlyCombinedData.length === 0) {
    return null;
  }

  const selectedData = selectedIndex !== null ? hourlyCombinedData[selectedIndex] : hourlyCombinedData[0];
  const indicatorPosition = selectedIndex !== null
    ? ((selectedIndex + 0.5) / hourlyCombinedData.length) * 100
    : 0;

  // Calculate total snow for the day
  const totalSnow = hourlyCombinedData.reduce((sum, hour) => sum + hour.snowAccumulation, 0);

  // Get sunrise/sunset times for the location
  const targetDateObj = targetDate ? new Date(targetDate) : new Date();
  const sunTimes = getSunriseSunset(latitude, longitude, targetDateObj);

  return (
    <div className="bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 border border-slate-700 mb-6">
      {/* Top row: Wind, Snow & Temp info with Arrow on right */}
      <div className="flex items-start justify-between mb-6 sm:mb-8">
        {/* Left side - Wind, Snow & Temp info side by side */}
        <div className="flex flex-row gap-4 sm:gap-6">
          {/* Wind info */}
          <div className="flex flex-col">
            <div className="text-base sm:text-lg font-semibold text-white mb-2">Wind</div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 tabular-nums">
                {selectedData.windSpeed}mph {get8DirectionLabel(selectedData.windDirection)}
              </div>
              <div className="text-sm sm:text-base text-slate-300 tabular-nums">
                {selectedData.windGust}mph gust
              </div>
            </div>
          </div>

          {/* Snow info */}
          <div className="flex flex-col">
            <div className="text-base sm:text-lg font-semibold text-white mb-2">Snow</div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-teal-light tabular-nums">
                {selectedData.snowAccumulation.toFixed(1)}" hourly
              </div>
              <div className="text-sm sm:text-base text-slate-300 tabular-nums">
                {totalSnow.toFixed(1)}" daily total
              </div>
            </div>
          </div>

          {/* Temperature info */}
          <div className="flex flex-col">
            <div className="text-base sm:text-lg font-semibold text-white mb-2">Temp</div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-orange-400 tabular-nums">
                {selectedData.temp}°F
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Wind Arrow Display */}
        <div className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
          <div
            className="relative"
            style={{
              transform: `rotate(${selectedData.windDirection}deg)`,
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            <svg width="60" height="60" viewBox="0 0 100 100" className="sm:w-[100px] sm:h-[100px]">
              <line
                x1="50"
                y1="75"
                x2="50"
                y2="25"
                stroke="#20B2AA"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <polygon
                points="50,18 58,30 42,30"
                fill="#20B2AA"
              />
              <polygon
                points="42,70 50,75 58,70 50,65"
                fill="#20B2AA"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Combined Bar Chart - showing both wind and snow */}
      <div className="relative h-40 mb-4">
        {/* Time display above white line */}
        {selectedIndex !== null && (
          <div
            className="absolute transform -translate-x-1/2 pointer-events-none z-20"
            style={{
              left: `${indicatorPosition}%`,
              top: '-20px'
            }}
          >
            <div className="text-sm font-semibold text-white whitespace-nowrap">
              {(() => {
                const hour = hourlyCombinedData[selectedIndex].hour;
                const period = hour >= 12 ? 'pm' : 'am';
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                return `${displayHour}:00${period}`;
              })()}
            </div>
          </div>
        )}

        <div
          ref={barRef}
          className="cursor-pointer relative rounded-lg overflow-hidden bg-slate-700"
          style={{ height: '160px' }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {}}
        >
          {/* Day/night shading background */}
          <div className="absolute inset-0 flex pointer-events-none" style={{ zIndex: 0 }}>
            {hourlyCombinedData.map((data, index) => {
              const opacity = getDayNightOpacity(data.hour, sunTimes);
              return (
                <div
                  key={`shade-${index}`}
                  className="flex-1"
                  style={{
                    minWidth: `${100 / hourlyCombinedData.length}%`,
                    backgroundColor: `rgba(71, 85, 105, ${opacity})`
                  }}
                />
              );
            })}
          </div>

          {/* Combined bars - absolute positioned */}
          <div className="absolute inset-0 flex items-end gap-1" style={{ zIndex: 50 }}>
            {hourlyCombinedData.map((data, index) => {
              // Wind bars (blue) - scale 0-30mph to 0-80px (half height)
              const windHeightPx = Math.min((data.windSpeed / 30) * 80, 80);

              // Snow bars (teal) - scale 0-2" to 0-80px (half height)
              const snowHeightPx = data.snowAccumulation > 0
                ? Math.max((data.snowAccumulation / 2) * 80, 15)
                : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-0.5 relative group" style={{ minWidth: `${100 / hourlyCombinedData.length}%` }}>
                  {/* Combined tooltip - shows wind, snow, and temp */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-600">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded"></div>
                        <span>{data.temp}°F</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded"></div>
                        <span>{data.windSpeed}mph wind</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-light rounded"></div>
                        <span>{data.snowAccumulation.toFixed(1)}" snow</span>
                      </div>
                    </div>
                  </div>

                  {/* Wind bar (top) */}
                  <div
                    className="w-full bg-blue-400 rounded-t"
                    style={{
                      height: `${windHeightPx}px`,
                      opacity: 0.6
                    }}
                  />

                  {/* Snow bar (bottom) */}
                  {snowHeightPx > 0 && (
                    <div
                      className="w-full bg-teal-light rounded-t"
                      style={{
                        height: `${snowHeightPx}px`,
                        opacity: 0.6
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Draggable indicator line - full height */}
          {selectedIndex !== null && (
            <div
              className="absolute w-1 bg-white shadow-lg pointer-events-none top-0 bottom-0"
              style={{
                left: `${indicatorPosition}%`,
                transform: 'translateX(-50%)',
                zIndex: 100
              }}
            />
          )}
        </div>
      </div>

      {/* Hour labels every 3 hours */}
      <div className="flex relative h-6 text-xs sm:text-sm">
        {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
          const hourIndex = hourlyCombinedData.findIndex(h => h.hour === hour);
          if (hourIndex === -1) return null;

          const position = ((hourIndex + 0.5) / hourlyCombinedData.length) * 100;
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return (
            <div
              key={hour}
              className="absolute text-center transform -translate-x-1/2"
              style={{ left: `${position}%` }}
            >
              <span className="text-xs sm:text-sm text-slate-400 font-medium">
                {displayHour}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 opacity-60 rounded"></div>
          <span className="text-slate-300">Wind (mph)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-teal-light opacity-60 rounded"></div>
          <span className="text-slate-300">Snow (in)</span>
        </div>
      </div>
    </div>
  );
}

export { SunTimesCard } from "./WindDirectionDisplay";
