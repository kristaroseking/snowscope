"use client";

import { useState, useEffect, useRef } from "react";
import { HourlyForecast } from "@/types";
import { getSunriseSunset, getDayNightOpacity } from "@/lib/utils/sunriseSunset";

interface SnowAccumulationDisplayProps {
  hourlyData: HourlyForecast[];
  targetDate?: string;
  latitude?: number;
  longitude?: number;
  selectedHourIndex?: number | null;
  onHourIndexChange?: (index: number | null) => void;
}

interface HourSnowData {
  hour: number;
  time: string;
  snowAccumulation: number;
}

export default function SnowAccumulationDisplay({ hourlyData, targetDate, latitude = 44.5305, longitude = -72.7817, selectedHourIndex, onHourIndexChange }: SnowAccumulationDisplayProps) {
  const [hourlySnowData, setHourlySnowData] = useState<HourSnowData[]>([]);
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
    const snowData: HourSnowData[] = [];

    // Create all 24 hours from 12am to 11pm
    for (let hourNum = 0; hourNum < 24; hourNum++) {
      const matchingHour = dayHours.find(h => {
        const hTime = new Date(h.time);
        return hTime.getHours() === hourNum;
      });

      if (matchingHour) {
        const hourTime = new Date(matchingHour.time);
        snowData.push({
          hour: hourNum,
          time: hourTime.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
          snowAccumulation: matchingHour.snowAccumulation || 0
        });
      }
    }

    setHourlySnowData(snowData);

    // Set default to current hour if viewing today (only if no external control)
    if (selectedHourIndex === undefined) {
      const today = new Date().toISOString().split('T')[0];
      if (targetDateString === today) {
        const currentHour = new Date().getHours();
        const currentIndex = snowData.findIndex(s => s.hour === currentHour);
        if (currentIndex !== -1) {
          updateSelectedIndex(currentIndex);
        }
      } else if (snowData.length > 0) {
        // Default to first hour for other days
        updateSelectedIndex(0);
      }
    }
  }, [hourlyData, targetDate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || hourlySnowData.length === 0) return;

    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    // Round to nearest hour segment to keep indicator centered
    const index = Math.round(percentage * hourlySnowData.length - 0.5);
    const clampedIndex = Math.max(0, Math.min(hourlySnowData.length - 1, index));

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

  if (hourlySnowData.length === 0) {
    return null;
  }

  const selectedSnow = selectedIndex !== null ? hourlySnowData[selectedIndex] : hourlySnowData[0];
  const indicatorPosition = selectedIndex !== null
    ? ((selectedIndex + 0.5) / hourlySnowData.length) * 100
    : 0;

  // Calculate total snow for the day
  const totalSnow = hourlySnowData.reduce((sum, hour) => sum + hour.snowAccumulation, 0);

  // Get sunrise/sunset times for the location
  const targetDateObj = targetDate ? new Date(targetDate) : new Date();
  const sunTimes = getSunriseSunset(latitude, longitude, targetDateObj);

  return (
    <div className="bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 border border-slate-700 mb-6">
      {/* Top row: Snow info */}
      <div className="flex items-start justify-between mb-6 sm:mb-8">
        {/* Snow accumulation info */}
        <div className="flex flex-col">
          <div className="text-base sm:text-lg font-semibold text-white mb-2">Snow accumulation</div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-4xl font-bold text-teal-light tabular-nums">
              {selectedSnow.snowAccumulation.toFixed(1)}" hourly
            </div>

            <div className="text-base sm:text-xl text-slate-300 tabular-nums">
              {totalSnow.toFixed(1)}" total for the day
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Bar Chart - showing snow accumulation for each hour */}
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
                const hour = hourlySnowData[selectedIndex].hour;
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
            {hourlySnowData.map((snowData, index) => {
              const opacity = getDayNightOpacity(snowData.hour, sunTimes);
              return (
                <div
                  key={`shade-${index}`}
                  className="flex-1"
                  style={{
                    minWidth: `${100 / hourlySnowData.length}%`,
                    backgroundColor: `rgba(71, 85, 105, ${opacity})` // slate-600
                  }}
                />
              );
            })}
          </div>

          {/* Snow accumulation bars - absolute positioned - FRONT */}
          <div className="absolute inset-0 flex items-end gap-1" style={{ zIndex: 50 }}>
            {hourlySnowData.map((snowData, index) => {
              // Base calculation: 0-2 inches maps to 0-128px (80% of 160px)
              // This gives us a good scale for typical hourly snowfall
              const baseHeightPx = (snowData.snowAccumulation / 2) * 128;

              // Add a boost factor for lower snow amounts to make differences more visible
              // For snow under 0.5 inches, add 50% boost
              const boost = snowData.snowAccumulation < 0.5 && snowData.snowAccumulation > 0 ? baseHeightPx * 0.5 : 0;

              // Ensure minimum height for non-zero values
              const heightPx = snowData.snowAccumulation > 0
                ? Math.max(baseHeightPx + boost, 20)
                : 0;

              return (
                <div
                  key={index}
                  className="flex-1 bg-teal-light rounded-t relative group"
                  style={{
                    height: `${heightPx}px`,
                    opacity: 0.5
                  }}
                  title={`${snowData.snowAccumulation.toFixed(1)}"`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-600">
                    {snowData.snowAccumulation.toFixed(1)}"
                  </div>
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
          // Find the index of this hour in hourlySnowData
          const hourIndex = hourlySnowData.findIndex(h => h.hour === hour);
          if (hourIndex === -1) return null; // Skip if hour not found

          // Calculate position based on the center of this hour's segment
          const position = ((hourIndex + 0.5) / hourlySnowData.length) * 100;
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
