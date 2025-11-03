"use client";

import { useState, useEffect, useRef } from "react";
import { HourlyForecast } from "@/types";
import { getSunriseSunset, getDayNightOpacity, formatTimeString } from "@/lib/utils/sunriseSunset";

interface WindDirectionDisplayProps {
  hourlyData: HourlyForecast[];
  targetDate?: string;
  latitude?: number;
  longitude?: number;
  selectedHourIndex?: number | null;
  onHourIndexChange?: (index: number | null) => void;
}

interface HourWindData {
  hour: number;
  time: string;
  windSpeed: number;
  windGust: number; // Estimate gusts as 1.3x wind speed
  windDirection: number;
}

export default function WindDirectionDisplay({ hourlyData, targetDate, latitude = 44.5305, longitude = -72.7817, selectedHourIndex, onHourIndexChange }: WindDirectionDisplayProps) {
  const [hourlyWindData, setHourlyWindData] = useState<HourWindData[]>([]);
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
    const windData: HourWindData[] = [];

    // Create all 24 hours from 12am to 11pm
    for (let hourNum = 0; hourNum < 24; hourNum++) {
      const matchingHour = dayHours.find(h => {
        const hTime = new Date(h.time);
        return hTime.getHours() === hourNum;
      });

      if (matchingHour) {
        const hourTime = new Date(matchingHour.time);
        const speed = Math.round(matchingHour.windSpeed);
        windData.push({
          hour: hourNum,
          time: hourTime.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
          windSpeed: speed,
          windGust: Math.round(speed * 1.3), // Estimate gusts
          windDirection: matchingHour.windDirection || 0
        });
      }
    }

    setHourlyWindData(windData);

    // Set default to current hour if viewing today (only if no external control)
    if (selectedHourIndex === undefined) {
      const today = new Date().toISOString().split('T')[0];
      if (targetDateString === today) {
        const currentHour = new Date().getHours();
        const currentIndex = windData.findIndex(w => w.hour === currentHour);
        if (currentIndex !== -1) {
          updateSelectedIndex(currentIndex);
        }
      } else if (windData.length > 0) {
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

  const getWindSpeedColor = (speed: number) => {
    if (speed <= 5) return "bg-emerald-500";
    if (speed <= 10) return "bg-green-500";
    if (speed <= 15) return "bg-lime-400";
    if (speed <= 20) return "bg-orange-400";
    return "bg-red-500";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || hourlyWindData.length === 0) return;

    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    // Round to nearest hour segment to keep indicator centered
    const index = Math.round(percentage * hourlyWindData.length - 0.5);
    const clampedIndex = Math.max(0, Math.min(hourlyWindData.length - 1, index));

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

  if (hourlyWindData.length === 0) {
    return null;
  }

  const selectedWind = selectedIndex !== null ? hourlyWindData[selectedIndex] : hourlyWindData[0];
  const indicatorPosition = selectedIndex !== null
    ? ((selectedIndex + 0.5) / hourlyWindData.length) * 100
    : 0;

  // Find max wind speed for chart scaling (use gusts too for better scaling)
  const maxWindSpeed = Math.max(...hourlyWindData.map(w => w.windGust), 20);

  // Get sunrise/sunset times for the location
  const targetDateObj = targetDate ? new Date(targetDate) : new Date();
  const sunTimes = getSunriseSunset(latitude, longitude, targetDateObj);

  return (
    <div className="bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 border border-slate-700 mb-6">
      {/* Top row: Wind info on left, Arrow on right */}
      <div className="flex items-start justify-between mb-6 sm:mb-8">
        {/* Left side - Wind info */}
        <div className="flex flex-col">
          <div className="text-base sm:text-lg font-semibold text-white mb-2">Wind</div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-4xl font-bold text-teal-light tabular-nums">
              {selectedWind.windSpeed}mph {get8DirectionLabel(selectedWind.windDirection)}
            </div>

            <div className="text-base sm:text-xl text-slate-300 tabular-nums">
              {selectedWind.windGust}mph gust
            </div>
          </div>
        </div>

        {/* Right side - Wind Arrow Display */}
        <div className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
          <div
            className="relative"
            style={{
              transform: `rotate(${selectedWind.windDirection}deg)`,
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            {/* Arrow */}
            <svg width="60" height="60" viewBox="0 0 100 100" className="sm:w-[100px] sm:h-[100px]">
              {/* Arrow shaft */}
              <line
                x1="50"
                y1="75"
                x2="50"
                y2="25"
                stroke="#20B2AA"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Arrow head */}
              <polygon
                points="50,18 58,30 42,30"
                fill="#20B2AA"
              />
              {/* Arrow tail fins */}
              <polygon
                points="42,70 50,75 58,70 50,65"
                fill="#20B2AA"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Vertical Bar Chart - showing wind speed for each hour */}
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
                const hour = hourlyWindData[selectedIndex].hour;
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
          onMouseLeave={() => {
            // Don't clear selection on mouse leave - persist last position
          }}
        >
          {/* Day/night shading background - behind bars */}
          <div className="absolute inset-0 flex pointer-events-none" style={{ zIndex: 0 }}>
            {hourlyWindData.map((windData, index) => {
              const opacity = getDayNightOpacity(windData.hour, sunTimes);
              return (
                <div
                  key={`shade-${index}`}
                  className="flex-1"
                  style={{
                    minWidth: `${100 / hourlyWindData.length}%`,
                    backgroundColor: `rgba(71, 85, 105, ${opacity})` // slate-600
                  }}
                />
              );
            })}
          </div>

          {/* Wind speed bars - absolute positioned - FRONT */}
          <div className="absolute inset-0 flex items-end gap-1" style={{ zIndex: 50 }}>
            {hourlyWindData.map((windData, index) => {
              // Base calculation: 0-30mph maps to 0-128px (80% of 160px)
              const baseHeightPx = (windData.windSpeed / 30) * 128;

              // Add a boost factor for lower wind speeds to make differences more visible
              // For winds under 10mph, add 50% boost
              const boost = windData.windSpeed < 10 ? baseHeightPx * 0.5 : 0;

              const heightPx = Math.max(baseHeightPx + boost, 20);

              return (
                <div
                  key={index}
                  className="flex-1 bg-teal-light rounded-t"
                  style={{
                    height: `${heightPx}px`,
                    opacity: 0.5
                  }}
                />
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
          // Find the index of this hour in hourlyWindData
          const hourIndex = hourlyWindData.findIndex(h => h.hour === hour);
          if (hourIndex === -1) return null; // Skip if hour not found

          // Calculate position based on the center of this hour's segment
          const position = ((hourIndex + 0.5) / hourlyWindData.length) * 100;
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
    </div>
  );
}

export function SunTimesCard({ sunTimes }: { sunTimes: { dawn: number; sunrise: number; sunset: number; dusk: number } }) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 border border-slate-700 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 sm:gap-0">
        {/* Sunrise section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sunrise icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full">
              {/* Sun */}
              <circle cx="32" cy="40" r="12" fill="#FDB813" />
              {/* Rays */}
              <line x1="32" y1="20" x2="32" y2="12" stroke="#FDB813" strokeWidth="2" strokeLinecap="round" />
              <line x1="44" y1="28" x2="49" y2="23" stroke="#FDB813" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="28" x2="15" y2="23" stroke="#FDB813" strokeWidth="2" strokeLinecap="round" />
              {/* Horizon line */}
              <line x1="8" y1="52" x2="56" y2="52" stroke="#5eead4" strokeWidth="2" />
              {/* Up arrow */}
              <polyline points="32,50 32,56 28,52 32,56 36,52" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Times */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">First Light</span>
              <span className="text-base sm:text-lg text-slate-300 tabular-nums font-semibold">{formatTimeString(sunTimes.dawn)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Sunrise</span>
              <span className="text-base sm:text-lg text-slate-300 tabular-nums font-semibold">{formatTimeString(sunTimes.sunrise)}</span>
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-24 h-px sm:w-px sm:h-24 bg-slate-700"></div>

        {/* Sunset section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sunset icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full">
              {/* Sun */}
              <circle cx="32" cy="40" r="12" fill="#FF6B35" />
              {/* Rays */}
              <line x1="32" y1="20" x2="32" y2="12" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
              <line x1="44" y1="28" x2="49" y2="23" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="28" x2="15" y2="23" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
              {/* Horizon line */}
              <line x1="8" y1="52" x2="56" y2="52" stroke="#5eead4" strokeWidth="2" />
              {/* Down arrow */}
              <polyline points="32,56 32,50 28,54 32,50 36,54" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Times */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Sunset</span>
              <span className="text-base sm:text-lg text-slate-300 tabular-nums font-semibold">{formatTimeString(sunTimes.sunset)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Last Light</span>
              <span className="text-base sm:text-lg text-slate-300 tabular-nums font-semibold">{formatTimeString(sunTimes.dusk)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
