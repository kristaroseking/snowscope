"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ElevationConditions from "@/components/ElevationConditions";
import BlogFeed from "@/components/BlogFeed";
import ResortHistory from "@/components/ResortHistory";
import LocalSpotlight from "@/components/LocalSpotlight";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import TodayConditionSummary from "@/components/TodayConditionSummary";
import HourlyForecast from "@/components/HourlyForecast";
import WindDirectionDisplay, { SunTimesCard } from "@/components/WindDirectionDisplay";
import { getSunriseSunset } from "@/lib/utils/sunriseSunset";
import { ResortWeather, LiveLiftStatus, LiveTrailStatus } from "@/types";
import { resortHistories } from "@/lib/resortHistories";
import { getWeeklySpotlight } from "@/lib/localSpotlights";
import { getResortSeasonStatus } from "@/lib/resortSeason";
import { LiftDetails } from "@/lib/liftDatabase";

export default function ResortPage() {
  const params = useParams();
  const resortId = params.id as string;

  const [weatherData, setWeatherData] = useState<ResortWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"current" | "resort-info" | "local" | "maps-and-lifts">("current");
  const [selectedElevation, setSelectedElevation] = useState<"base" | "mid" | "summit">("mid");
  const [liveLifts, setLiveLifts] = useState<LiveLiftStatus[] | null>(null);
  const [liveLiftsLoading, setLiveLiftsLoading] = useState(false);
  const [liveLiftsError, setLiveLiftsError] = useState<string | null>(null);
  const [liveTrails, setLiveTrails] = useState<LiveTrailStatus[] | null>(null);
  const [trailFilter, setTrailFilter] = useState<"all" | "newly-opened" | "newly-closed">("all");
  const [showGYMTLOverlay, setShowGYMTLOverlay] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [visibleWordIndex, setVisibleWordIndex] = useState(0);
  const [isTrailMapCollapsed, setIsTrailMapCollapsed] = useState(true);
  const [isLiftSpecsCollapsed, setIsLiftSpecsCollapsed] = useState(true);
  const [forecastDayScores, setForecastDayScores] = useState<{score: number; rating: string}[][]>([]);
  const [scoresLoading, setScoresLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today, 1-9 = future days
  const [selectedHourIndex, setSelectedHourIndex] = useState<number | null>(null); // Shared state for rating bar and wind chart

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather/${resortId}`);
        const result = await response.json();

        if (result.success) {
          setWeatherData(result.data);
        } else {
          setError(result.error || "Failed to fetch weather data");
        }
      } catch (err) {
        setError("Failed to fetch weather data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [resortId]);

  // Fetch live lift status when lifts tab is selected
  // Supported resorts: stowe, mad-river-glen, jay-peak, sugarbush, killington, sunday-river, mammoth
  const supportedLiftResorts = [
    "stowe",
    "mad-river-glen",
    "jay-peak",
    "sugarbush",
    "killington",
    "sunday-river",
    "mammoth",
  ];

  useEffect(() => {
    if (selectedTab === "resort-info" && supportedLiftResorts.includes(resortId) && !liveLifts && !liveLiftsLoading) {
      const fetchLiveLifts = async () => {
        setLiveLiftsLoading(true);
        try {
          const response = await fetch(`/api/lift-status/${resortId}`);
          const result = await response.json();

          if (result.success) {
            if (result.data.lifts.length > 0) {
              setLiveLifts(result.data.lifts);
              setLiveTrails(result.data.trails || []);
            } else {
              // Empty lift array during off-season
              setLiveLiftsError("No live lift data available (off-season)");
            }
          } else {
            setLiveLiftsError(result.error || "No live lift data available");
          }
        } catch (err) {
          setLiveLiftsError("Failed to fetch live lift status");
          console.error(err);
        } finally {
          setLiveLiftsLoading(false);
        }
      };

      fetchLiveLifts();
    }
    // Only re-run when tab or resortId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, resortId]);

  // Handle GYMTL overlay
  useEffect(() => {
    if (selectedTab === "local") {
      setShowGYMTLOverlay(true);
      setShowCloseButton(false);
      setVisibleWordIndex(0);

      // Animate words sequentially
      const wordTimers: NodeJS.Timeout[] = [];

      // Show each word one at a time (5 words total, 400ms each)
      for (let i = 1; i <= 5; i++) {
        wordTimers.push(
          setTimeout(() => {
            setVisibleWordIndex(i);
          }, i * 400)
        );
      }

      // Show close button after all words are visible
      const closeButtonTimer = setTimeout(() => {
        setShowCloseButton(true);
      }, 2400);

      return () => {
        wordTimers.forEach(timer => clearTimeout(timer));
        clearTimeout(closeButtonTimer);
      };
    }
  }, [selectedTab]);

  // Fetch period scores for forecast cards
  useEffect(() => {
    const fetchForecastScores = async () => {
      if (!weatherData || selectedTab !== "current") {
        return;
      }

      const forecastDays = forecast[selectedElevation];
      const baseDepth = current[selectedElevation].snowDepth || 0;

      const allScoresPromises = forecastDays.map(async (day) => {
        const periods = [
          { label: "Morning", temp: day.tempLow + 2, snow: day.snowAccumulation * 0.3 },
          { label: "Afternoon", temp: day.tempHigh, snow: day.snowAccumulation * 0.4 },
          { label: "Evening", temp: (day.tempHigh + day.tempLow) / 2, snow: day.snowAccumulation * 0.3 }
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
      setForecastDayScores(allScores);
      setScoresLoading(false);
    };

    if (selectedTab === "current") {
      setScoresLoading(true);
      fetchForecastScores();
    }
  }, [selectedTab, selectedElevation, weatherData]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!weatherData) return <ErrorState message="Resort not found" />;

  const { resort, current, forecast } = weatherData;

  // Helper function to get lift comfort rating based on wind speed
  const getLiftComfortRating = (windSpeed: number) => {
    if (windSpeed <= 5) return { rating: "EXCELLENT", color: "bg-emerald-500", textColor: "text-emerald-100" };
    if (windSpeed <= 10) return { rating: "GOOD", color: "bg-green-500", textColor: "text-green-100" };
    if (windSpeed <= 15) return { rating: "FAIR", color: "bg-lime-400", textColor: "text-lime-900" };
    if (windSpeed <= 20) return { rating: "POOR", color: "bg-orange-400", textColor: "text-orange-900" };
    return { rating: "HORRIBLE", color: "bg-red-500", textColor: "text-red-100" };
  };

  // Helper function to convert snowfall to range format
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

  // Helper function to check if resort is currently open
  const isResortOpen = () => {
    if (!resort.season) return true; // If no season data, assume open

    const today = new Date();
    const openingDate = new Date(resort.season.openingDay);
    const closingDate = new Date(resort.season.closingDay);

    return today >= openingDate && today <= closingDate;
  };

  // Helper function to get color based on score or rating
  const getScoreColor = (score: number, rating?: string) => {
    if (rating === "GO_SURFING") return "bg-gray-500";

    // If resort isn't open yet, cap at yellow/lime (no green)
    if (!isResortOpen()) {
      if (score >= 50) return "bg-lime-400";
      if (score >= 30) return "bg-orange-400";
      return "bg-red-500";
    }

    // Normal color scale when resort is open
    if (score >= 80) return "bg-emerald-500";
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-lime-400";
    if (score >= 30) return "bg-orange-400";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="text-teal-light hover:text-teal text-sm font-medium mb-3 inline-block transition-colors"
          >
            ← Back to all resorts
          </Link>
          <h1 className="text-4xl font-bold text-white tracking-tight">{resort.name}</h1>
          <p className="text-slate-300 mt-2 leading-relaxed">
            {resort.state}, {resort.country}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Horizontal Tabs */}
        <div className="mb-8 border-b border-slate-700">
          <div className="flex gap-8">
            <button
              onClick={() => setSelectedTab("current")}
              className={`pb-4 px-2 text-lg font-semibold transition-all relative ${
                selectedTab === "current"
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Conditions
              {selectedTab === "current" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedTab("resort-info")}
              className={`pb-4 px-2 text-lg font-semibold transition-all relative ${
                selectedTab === "resort-info"
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Lift and Trail Status
              {selectedTab === "resort-info" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedTab("maps-and-lifts")}
              className={`pb-4 px-2 text-lg font-semibold transition-all relative ${
                selectedTab === "maps-and-lifts"
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Resort Information
              {selectedTab === "maps-and-lifts" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedTab("local")}
              className={`pb-4 px-2 text-lg font-semibold transition-all relative ${
                selectedTab === "local"
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              GYMTL
              {selectedTab === "local" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal rounded-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div>
          <div className="space-y-12">
        {/* Current Conditions Tab */}
        {selectedTab === "current" && (
          <div className="mb-12">
            {/* Elevation Selector for Current Conditions */}
            <div className="mb-6 flex justify-start">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedElevation("base")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedElevation === "base"
                      ? "bg-teal text-white shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block">
                    <defs>
                      <clipPath id="base-clip">
                        <path d="M8 2 L14 14 L2 14 Z" />
                      </clipPath>
                    </defs>
                    <path
                      d="M8 2 L14 14 L2 14 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="2"
                      y="10"
                      width="12"
                      height="4"
                      fill="currentColor"
                      clipPath="url(#base-clip)"
                    />
                  </svg>
                  Base
                </button>
                <button
                  onClick={() => setSelectedElevation("mid")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedElevation === "mid"
                      ? "bg-teal text-white shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block">
                    <defs>
                      <clipPath id="mid-clip">
                        <path d="M8 2 L14 14 L2 14 Z" />
                      </clipPath>
                    </defs>
                    <path
                      d="M8 2 L14 14 L2 14 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="2"
                      y="6"
                      width="12"
                      height="4"
                      fill="currentColor"
                      clipPath="url(#mid-clip)"
                    />
                  </svg>
                  Mid
                </button>
                <button
                  onClick={() => setSelectedElevation("summit")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedElevation === "summit"
                      ? "bg-teal text-white shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block">
                    <defs>
                      <clipPath id="summit-clip">
                        <path d="M8 2 L14 14 L2 14 Z" />
                      </clipPath>
                    </defs>
                    <path
                      d="M8 2 L14 14 L2 14 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="2"
                      y="2"
                      width="12"
                      height="4"
                      fill="currentColor"
                      clipPath="url(#summit-clip)"
                    />
                  </svg>
                  Summit
                </button>
              </div>
            </div>

            {/* Top Row: 1/3 Current Conditions, 2/3 Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 lg:items-stretch">
              {/* Current Conditions Card - 1/3 width */}
              <div className="h-full">
                <ElevationConditions
                  elevation={
                    selectedElevation === "base"
                      ? "Base"
                      : selectedElevation === "mid"
                      ? "Mid Mountain"
                      : "Summit"
                  }
                  elevationFeet={resort.elevations[selectedElevation]}
                  conditions={current[selectedElevation]}
                />
              </div>

              {/* Combined Summary Card - 2/3 width */}
              <div className="lg:col-span-2 bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Conditions Summary
                </h3>
                <div className="text-slate-300 leading-relaxed mb-4">
                  {(() => {
                    const selectedConditions = current[selectedElevation];
                    const avgTemp = selectedConditions.temp;
                    const avgSnow24h = selectedConditions.snowfall24h;
                    const avgWind = selectedConditions.windSpeed;

                    // Determine season
                    const today = new Date();
                    const month = today.getMonth(); // 0-11
                    let season = "mid-season";
                    if (month >= 10 || month <= 0) season = "early season";
                    else if (month >= 3 && month <= 4) season = "late season";

                    // Build summary
                    let summary = "";

                    // Temperature assessment
                    if (avgTemp < 20) {
                      summary += "❄️ Cold conditions prevail across the mountain with temperatures averaging " + avgTemp + "°F. ";
                      summary += "Expect excellent snow preservation and minimal melting. Dress warmly in layers. ";
                    } else if (avgTemp < 32) {
                      summary += "🌡️ Ideal ski temperatures around " + avgTemp + "°F provide comfortable conditions with well-preserved snow. ";
                    } else {
                      summary += "☀️ Warmer temperatures averaging " + avgTemp + "°F may cause softer snow conditions, especially on south-facing slopes. ";
                      summary += "Morning skiing recommended for firmer surfaces. ";
                    }

                    // Snowfall assessment
                    if (avgSnow24h > 6) {
                      summary += "🎿 Exceptional fresh snow in the last 24 hours (" + avgSnow24h.toFixed(1) + "\" average). ";
                      summary += "Powder conditions throughout the resort. ";
                    } else if (avgSnow24h > 3) {
                      summary += "🎿 Good recent snowfall (" + avgSnow24h.toFixed(1) + "\" in 24h) has refreshed the slopes. ";
                    } else if (avgSnow24h > 0.5) {
                      summary += "Light snow (" + avgSnow24h.toFixed(1) + "\") has dusted the mountain. ";
                    } else {
                      summary += "No significant fresh snow in the last 24 hours. ";
                    }

                    // Wind assessment
                    if (avgWind > 30) {
                      summary += "⚠️ Strong winds averaging " + avgWind + " mph may affect lift operations, particularly on exposed ridgelines. ";
                      summary += "Summit lifts could experience delays. ";
                    } else if (avgWind > 20) {
                      summary += "💨 Moderate winds at " + avgWind + " mph. Upper mountain may be breezy. ";
                    } else {
                      summary += "Calm winds at " + avgWind + " mph make for pleasant skiing conditions. ";
                    }

                    // Season context
                    if (season === "early season") {
                      summary += "Early season conditions - check trail reports as coverage may be limited on lower elevation runs.";
                    } else if (season === "late season") {
                      summary += "Late season means variable conditions. Higher elevations typically offer the best snow quality.";
                    } else {
                      summary += "Prime mid-season skiing with good base depths expected across the mountain.";
                    }

                    return <p>{summary}</p>;
                  })()}
                </div>

                {/* Trail Conditions Section */}
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <h4 className="text-base font-semibold text-white mb-3">
                    Trail Conditions
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      const selectedConditions = current[selectedElevation];
                      const avgTemp = selectedConditions.temp;
                      const avgSnow24h = selectedConditions.snowfall24h;

                      // Determine season
                      const today = new Date();
                      const month = today.getMonth();
                      let season = "mid-season";
                      if (month >= 10 || month <= 0) season = "early season";
                      else if (month >= 3 && month <= 4) season = "late season";

                      const conditions = [];

                      // Grooming
                      if (avgSnow24h > 3) {
                        conditions.push({ icon: "🚜", text: "Fresh corduroy with powder off-piste" });
                      } else if (avgSnow24h > 0.5) {
                        conditions.push({ icon: "🚜", text: "Groomed runs with fresh surface" });
                      } else {
                        conditions.push({ icon: "🚜", text: "Firm, fast corduroy" });
                      }

                      // Snowmaking
                      if (avgTemp < 28) {
                        conditions.push({ icon: "❄️", text: season === "early season" ? "Snowmaking active on priority trails" : "Snowmaking supplementing high-traffic areas" });
                      } else if (avgTemp < 32) {
                        conditions.push({ icon: "🌡️", text: "Limited snowmaking overnight" });
                      } else {
                        conditions.push({ icon: "☀️", text: "No snowmaking (too warm)" });
                      }

                      // Coverage
                      if (season === "early season") {
                        conditions.push({ icon: "🎿", text: "Early season: Main trails open, watch for thin spots" });
                      } else if (season === "late season") {
                        conditions.push({ icon: "🌄", text: "Late season: Best on north faces & upper elevations" });
                      } else {
                        if (avgSnow24h > 6) {
                          conditions.push({ icon: "🎿", text: "Excellent coverage, off-piste skiable" });
                        } else {
                          conditions.push({ icon: "🎿", text: "Good coverage across all terrain" });
                        }
                      }

                      return (
                        <>
                          {conditions.map((condition, index) => (
                            <div key={index} className="flex items-start gap-3 text-slate-300">
                              <span className="text-xl">{condition.icon}</span>
                              <span className="flex-1">{condition.text}</span>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic mt-4">AI Generated</p>
              </div>
            </div>

            {/* 10-Day Forecast Cards */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                10-Day Forecast
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
                {forecast[selectedElevation].map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                  const isSelected = selectedDay === index;

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`flex flex-col items-center text-center border rounded-lg p-4 transition-all cursor-pointer ${
                        isSelected
                          ? "border-teal bg-slate-750 shadow-lg scale-105"
                          : "border-slate-600 bg-slate-750 hover:bg-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-1">
                        <span>{dayName}</span>
                        <span className="text-slate-400 font-normal">{date.getMonth() + 1}/{date.getDate()}</span>
                      </div>
                      <div className="text-2xl font-bold mb-2 tabular-nums text-teal-light">
                        {getSnowfallRange(day.snowAccumulation)}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm mb-2 tabular-nums">
                        <span className="text-slate-300">{Math.round((day.tempHigh + day.tempLow) / 2)}°</span>
                        <span className="text-slate-400">{day.windSpeed} mph</span>
                      </div>
                      <div className="text-3xl mb-3 cursor-pointer relative group">
                        {day.weatherDescription}
                        {/* Custom tooltip */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-slate-600">
                          {getWeatherText(day.weatherDescription)}
                        </div>
                      </div>
                      {/* Three horizontal condition bars */}
                      <div className="w-full flex gap-0.5 mt-auto pt-3 border-t border-slate-600">
                        {scoresLoading || !forecastDayScores[index] ? (
                          // Loading state: show grey bars
                          <>
                            <div className="flex-1 h-2 rounded-full bg-slate-600 animate-pulse" title="Morning" />
                            <div className="flex-1 h-2 rounded-full bg-slate-600 animate-pulse" title="Afternoon" />
                            <div className="flex-1 h-2 rounded-full bg-slate-600 animate-pulse" title="Evening" />
                          </>
                        ) : (
                          // Show actual scores for this day
                          forecastDayScores[index].map((period, periodIndex) => (
                            <div
                              key={periodIndex}
                              className={`flex-1 h-2 rounded-full ${getScoreColor(period.score, period.rating)}`}
                              title={`${["Morning", "Afternoon", "Evening"][periodIndex]}: ${period.rating === "GO_SURFING" ? "Go Surfing" : period.rating}`}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Day's Condition Summary */}
            <TodayConditionSummary
              elevation={selectedElevation}
              conditions={current[selectedElevation]}
              hourlyData={weatherData.hourly?.[selectedElevation]}
              selectedDayIndex={selectedDay}
              forecastDay={forecast[selectedElevation][selectedDay]}
              latitude={resort.latitude}
              longitude={resort.longitude}
              selectedHourIndex={selectedHourIndex}
              onHourIndexChange={setSelectedHourIndex}
            />

            {/* Wind Direction Display */}
            {weatherData.hourly && (
              <WindDirectionDisplay
                hourlyData={weatherData.hourly[selectedElevation]}
                targetDate={forecast[selectedElevation][selectedDay]?.date}
                latitude={resort.latitude}
                longitude={resort.longitude}
                selectedHourIndex={selectedHourIndex}
                onHourIndexChange={setSelectedHourIndex}
              />
            )}

            {/* Sun Times Card */}
            {weatherData.hourly && (
              <SunTimesCard
                sunTimes={getSunriseSunset(
                  resort.latitude,
                  resort.longitude,
                  forecast[selectedElevation][selectedDay]?.date ? new Date(forecast[selectedElevation][selectedDay].date) : new Date()
                )}
              />
            )}

            {/* Selected Day's Hourly Forecast */}
            {weatherData.hourly && (
              <HourlyForecast
                hourlyData={weatherData.hourly[selectedElevation]}
                elevation={selectedElevation}
                selectedDayIndex={selectedDay}
                targetDate={forecast[selectedElevation][selectedDay]?.date}
              />
            )}

          </div>
        )}

        {/* Lift and Trail Status Tab */}
        {selectedTab === "resort-info" && (
          <div className="mb-12">
            {/* Resort Status Banner */}
            {(() => {
              const seasonStatus = getResortSeasonStatus(resort);
              if (!seasonStatus.isOpen) {
                return (
                  <div className="bg-red-900/30 border-2 border-red-700 rounded-lg p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">⛔</div>
                      <div>
                        <h4 className="text-red-200 font-bold text-lg mb-1">
                          RESORT CLOSED
                        </h4>
                        <p className="text-red-100 text-base font-medium">
                          {seasonStatus.message}
                        </p>
                        <p className="text-red-200 text-sm mt-2">
                          Information shown below is for reference only.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      <span className="text-green-100 text-base font-medium">
                        {seasonStatus.message}
                      </span>
                    </div>
                  </div>
                );
              }
            })()}

            {/* Live Lift Status Section */}
            {supportedLiftResorts.includes(resortId) && (
              <div className="mb-6">
                {liveLiftsLoading && (
                  <div className="bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700">
                    <p className="text-slate-300">Loading live lift status...</p>
                  </div>
                )}

                {!liveLiftsLoading && liveLiftsError && (
                  <div className="bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-2">Live Lift Status</h3>
                    <p className="text-slate-400 text-sm">{liveLiftsError}</p>
                    <p className="text-slate-500 text-xs mt-2">Showing static lift information below</p>
                  </div>
                )}

                {liveLifts && liveLifts.length > 0 && (
                  <div className="bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Current Lift Status
                      </h3>
                      <span className="text-xs text-slate-400">
                        Live from {resort.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {liveLifts.map((lift, index) => {
                        let statusColor = "text-slate-400 bg-slate-700";

                        if (lift.status === "Open") {
                          statusColor = "text-green-400 bg-green-900/30";
                        } else if (lift.status === "Closed") {
                          statusColor = "text-red-400 bg-red-900/30";
                        } else if (lift.status === "On-Hold") {
                          statusColor = "text-orange-400 bg-orange-900/30";
                        } else if (lift.status === "Scheduled") {
                          statusColor = "text-yellow-300 bg-yellow-900/30";
                        }

                        // Get lift comfort rating based on current wind conditions
                        const liftComfort = getLiftComfortRating(current.mid.windSpeed);

                        return (
                          <div
                            key={index}
                            className="border border-slate-700 rounded-lg p-4 bg-slate-800/50"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="font-semibold text-white text-base mb-1">
                                  {lift.name}
                                </div>
                                <div className="text-sm text-slate-300">
                                  {lift.type}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                    Comfort
                                  </div>
                                  <div className={`${liftComfort.color} ${liftComfort.textColor} px-3 py-1 rounded-lg text-xs font-bold shadow-sm`}>
                                    {liftComfort.rating}
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor} whitespace-nowrap`}>
                                  {lift.status}
                                </div>
                              </div>
                            </div>

                            {/* Lift specifications */}
                            {(lift.manufacturer || lift.yearBuilt || lift.speed || lift.rideTime || lift.length || lift.verticalRise || lift.capacity) && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                {lift.manufacturer && (
                                  <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                                      Manufacturer
                                    </div>
                                    <div className="text-sm text-slate-200 font-medium">
                                      {lift.manufacturer}
                                    </div>
                                  </div>
                                )}
                                {lift.yearBuilt && (
                                  <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                                      Year Built
                                    </div>
                                    <div className="text-sm text-slate-200 font-medium">
                                      {lift.yearBuilt}
                                    </div>
                                  </div>
                                )}
                                {lift.speed && (
                                  <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                                      Speed
                                    </div>
                                    <div className="text-sm text-slate-200 font-medium">
                                      {lift.speed} ft/min
                                    </div>
                                  </div>
                                )}
                                {lift.rideTime && (
                                  <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                                      Ride Time
                                    </div>
                                    <div className="text-sm text-slate-200 font-medium">
                                      {lift.rideTime} min
                                    </div>
                                  </div>
                                )}
                                {lift.length && (
                                  <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                                      Length
                                    </div>
                                    <div className="text-sm text-slate-200 font-medium">
                                      {lift.length.toLocaleString()} ft
                                    </div>
                                  </div>
                                )}
                                {lift.verticalRise && (
                                  <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                                      Vertical Rise
                                    </div>
                                    <div className="text-sm text-slate-200 font-medium">
                                      {lift.verticalRise.toLocaleString()} ft
                                    </div>
                                  </div>
                                )}
                                {lift.capacity && (
                                  <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                                      Capacity
                                    </div>
                                    <div className="text-sm text-slate-200 font-medium">
                                      {lift.capacity.toLocaleString()} /hr
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Description */}
                            {lift.description && (
                              <div className="pt-3 border-t border-slate-700">
                                <p className="text-sm text-slate-300 leading-relaxed">
                                  {lift.description}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-500 italic">
                        Last updated: {liveLifts[0]?.lastUpdated ? new Date(liveLifts[0].lastUpdated).toLocaleString() : "Unknown"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Trail Status Section */}
            {supportedLiftResorts.includes(resortId) && liveTrails && liveTrails.length > 0 && (
              <div className="mb-6">
                <div className="bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Trail Status
                    </h3>
                    {/* Filter buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTrailFilter("all")}
                        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                          trailFilter === "all"
                            ? "bg-teal text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setTrailFilter("newly-opened")}
                        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                          trailFilter === "newly-opened"
                            ? "bg-green-600 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        Newly Opened
                      </button>
                      <button
                        onClick={() => setTrailFilter("newly-closed")}
                        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                          trailFilter === "newly-closed"
                            ? "bg-red-600 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        Newly Closed
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {(() => {
                      // Apply filter
                      let filteredTrails = liveTrails;
                      if (trailFilter === "newly-opened") {
                        filteredTrails = liveTrails.filter(trail => trail.isNewlyOpened);
                      } else if (trailFilter === "newly-closed") {
                        filteredTrails = liveTrails.filter(trail => trail.isNewlyClosed);
                      }

                      if (filteredTrails.length === 0) {
                        return (
                          <div className="text-center py-6 text-slate-400">
                            No {trailFilter === "all" ? "" : trailFilter.replace("-", " ")} trails to display
                          </div>
                        );
                      }

                      return filteredTrails.map((trail, index) => {
                        let statusColor = "text-slate-400 bg-slate-700";
                        if (trail.status === "Open") {
                          statusColor = "text-green-400 bg-green-900/30";
                        } else if (trail.status === "Closed") {
                          statusColor = "text-red-400 bg-red-900/30";
                        } else if (trail.status === "On-Hold") {
                          statusColor = "text-orange-400 bg-orange-900/30";
                        } else if (trail.status === "Scheduled") {
                          statusColor = "text-yellow-300 bg-yellow-900/30";
                        }

                        // Difficulty icon
                        let difficultyIcon = "●";
                        let difficultyColor = "text-blue-400";
                        if (trail.difficulty === "Green Circle") {
                          difficultyIcon = "●";
                          difficultyColor = "text-green-400";
                        } else if (trail.difficulty === "Blue Square") {
                          difficultyIcon = "■";
                          difficultyColor = "text-blue-400";
                        } else if (trail.difficulty === "Black Diamond") {
                          difficultyIcon = "◆";
                          difficultyColor = "text-black";
                        } else if (trail.difficulty === "Double Black Diamond") {
                          difficultyIcon = "◆◆";
                          difficultyColor = "text-black";
                        } else if (trail.difficulty === "Terrain Park") {
                          difficultyIcon = "▲";
                          difficultyColor = "text-orange-400";
                        } else if (trail.difficulty === "Glades") {
                          difficultyIcon = "🌲";
                          difficultyColor = "";
                        }

                        return (
                          <div
                            key={index}
                            className="border border-slate-700 rounded-lg p-4 bg-slate-800/50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <span className={`text-2xl ${difficultyColor}`}>
                                  {difficultyIcon}
                                </span>
                                <div>
                                  <div className="font-semibold text-white text-base">
                                    {trail.name}
                                  </div>
                                  <div className="text-sm text-slate-400">
                                    {trail.difficulty}
                                    {trail.groomed && " • Groomed"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {trail.isNewlyOpened && (
                                  <span className="text-xs font-semibold text-green-300 bg-green-900/30 px-2 py-1 rounded">
                                    NEW
                                  </span>
                                )}
                                {trail.isNewlyClosed && (
                                  <span className="text-xs font-semibold text-red-300 bg-red-900/30 px-2 py-1 rounded">
                                    CLOSED
                                  </span>
                                )}
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor} whitespace-nowrap`}>
                                  {trail.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500 italic">
                      Last updated: {liveTrails[0]?.lastUpdated ? new Date(liveTrails[0].lastUpdated).toLocaleString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Resort Information Tab */}
        {selectedTab === "maps-and-lifts" && (
          <div className="mb-12">
            {/* Trail Map Section */}
            {(() => {
              const { getTrailMapData } = require("@/lib/trailMapUrls");
              const trailMapData = getTrailMapData(resortId);

              if (trailMapData) {
                return (
                  <div className="bg-slate-800 rounded-card shadow-sm border border-slate-700 mb-6">
                    <div
                      className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-750 transition-colors"
                      onClick={() => setIsTrailMapCollapsed(!isTrailMapCollapsed)}
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          Trail Map
                        </h3>
                        <svg
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            isTrailMapCollapsed ? "" : "rotate-180"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {trailMapData.pdfUrl && (
                          <a
                            href={trailMapData.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-teal hover:bg-teal-light text-white text-sm font-medium rounded transition-colors"
                          >
                            Download PDF
                          </a>
                        )}
                        <a
                          href={trailMapData.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded transition-colors"
                        >
                          Open Full Size
                        </a>
                      </div>
                    </div>

                    {!isTrailMapCollapsed && (
                      <>
                        <div className="px-6 pb-6">
                          <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                            <img
                              src={trailMapData.imageUrl}
                              alt={`${resort.name} Trail Map`}
                              className="w-full h-auto"
                              style={{ maxHeight: "800px", objectFit: "contain" }}
                            />
                          </div>
                        </div>

                        <div className="px-6 pb-6 pt-0">
                          <div className="pt-4 border-t border-slate-700">
                            <p className="text-xs text-slate-500 italic">
                              Trail map provided by {trailMapData.source}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            {/* Static Lift Database */}
            {(() => {
              const { getResortLifts } = require("@/lib/liftDatabase");
              const staticLifts = getResortLifts(resort.id);

              if (staticLifts && staticLifts.length > 0) {
                return (
                  <div className="bg-slate-800 rounded-card shadow-sm border border-slate-700 mb-6">
                    <div
                      className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-750 transition-colors"
                      onClick={() => setIsLiftSpecsCollapsed(!isLiftSpecsCollapsed)}
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          Lift Details
                        </h3>
                        <svg
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            isLiftSpecsCollapsed ? "" : "rotate-180"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded" onClick={(e) => e.stopPropagation()}>
                        {staticLifts.length} {staticLifts.length === 1 ? 'Lift' : 'Lifts'}
                      </span>
                    </div>

                    {!isLiftSpecsCollapsed && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 gap-4">
                      {staticLifts.map((lift: LiftDetails, index: number) => (
                        <div key={index} className="border border-slate-700 rounded-lg p-4 bg-slate-800/50 hover:bg-slate-750 transition-colors">
                          <div className="mb-3">
                            <div className="font-semibold text-white text-base mb-1">
                              {lift.name}
                            </div>
                            <div className="text-sm text-teal">
                              {lift.type}
                            </div>
                          </div>

                          {/* Lift specifications grid */}
                          {(lift.manufacturer || lift.yearBuilt || lift.speed || lift.rideTime || lift.length || lift.verticalRise || lift.capacity) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              {lift.manufacturer && (
                                <div>
                                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                                    Manufacturer
                                  </div>
                                  <div className="text-sm text-slate-200 font-medium">
                                    {lift.manufacturer}
                                  </div>
                                </div>
                              )}
                              {lift.yearBuilt && (
                                <div>
                                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                                    Year Built
                                  </div>
                                  <div className="text-sm text-slate-200 font-medium">
                                    {lift.yearBuilt}
                                  </div>
                                </div>
                              )}
                              {lift.speed && (
                                <div>
                                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                                    Speed
                                  </div>
                                  <div className="text-sm text-slate-200 font-medium">
                                    {lift.speed} ft/min
                                  </div>
                                </div>
                              )}
                              {lift.rideTime && (
                                <div>
                                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                                    Ride Time
                                  </div>
                                  <div className="text-sm text-slate-200 font-medium">
                                    {lift.rideTime} min
                                  </div>
                                </div>
                              )}
                              {lift.length && (
                                <div>
                                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                                    Length
                                  </div>
                                  <div className="text-sm text-slate-200 font-medium">
                                    {lift.length.toLocaleString()} ft
                                  </div>
                                </div>
                              )}
                              {lift.verticalRise && (
                                <div>
                                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                                    Vertical Rise
                                  </div>
                                  <div className="text-sm text-slate-200 font-medium">
                                    {lift.verticalRise.toLocaleString()} ft
                                  </div>
                                </div>
                              )}
                              {lift.capacity && (
                                <div>
                                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                                    Capacity
                                  </div>
                                  <div className="text-sm text-slate-200 font-medium">
                                    {lift.capacity.toLocaleString()} /hr
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Description */}
                          {lift.description && (
                            <div className="pt-3 border-t border-slate-700">
                              <p className="text-sm text-slate-300 leading-relaxed">
                                {lift.description}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <p className="text-xs text-slate-500 italic">
                            Lift specifications from liftblog.com and public sources
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}

        {/* GYMTL Tab */}
        {selectedTab === "local" && (
          <div className="mb-12">
            <div className="space-y-8">
              {/* Resort History Section */}
              {resortHistories[resortId] && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white tracking-tight">
                      Resort History
                    </h2>
                    <div className="h-1 w-16 bg-teal rounded-full mt-3"></div>
                  </div>
                  <ResortHistory
                    resortName={resort.name}
                    history={resortHistories[resortId]}
                  />
                </div>
              )}

              {/* Weekly Local Spotlight */}
              {(() => {
                const spotlight = getWeeklySpotlight(resortId);
                if (!spotlight) return null;

                return (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-white tracking-tight">
                        This Week's Local Spotlight
                      </h2>
                      <div className="h-1 w-16 bg-teal rounded-full mt-3"></div>
                      <p className="text-slate-400 text-sm mt-2">
                        Every week we highlight a different local business, hero, or
                        project that makes this mountain community special. Come back
                        next week to discover something new!
                      </p>
                    </div>
                    <LocalSpotlight spotlight={spotlight} />
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Blog Section */}
        {resort.blogUrl && (
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white tracking-tight">Weather Blog</h2>
              <div className="h-1 w-16 bg-teal rounded-full mt-3"></div>
            </div>
            <BlogFeed resortId={resort.id} resortName={resort.name} />
          </div>
        )}
          </div>
        </div>
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-400 text-sm">
            Last updated: {new Date(weatherData.lastUpdated).toLocaleString()}
          </p>
        </div>
      </footer>

      {/* GYMTL Full Page Overlay */}
      {showGYMTLOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8">
              {visibleWordIndex >= 1 && (
                <span className="block animate-fadeIn">
                  <span className="text-teal">G</span>
                  <span className="text-white">IVE</span>
                </span>
              )}
              {visibleWordIndex >= 2 && (
                <span className="block mt-4 animate-fadeIn">
                  <span className="text-teal">Y</span>
                  <span className="text-white">OUR</span>
                </span>
              )}
              {visibleWordIndex >= 3 && (
                <span className="block mt-4 animate-fadeIn">
                  <span className="text-teal">M</span>
                  <span className="text-white">ONEY</span>
                </span>
              )}
              {visibleWordIndex >= 4 && (
                <span className="block mt-4 animate-fadeIn">
                  <span className="text-teal">T</span>
                  <span className="text-white">O</span>
                </span>
              )}
              {visibleWordIndex >= 5 && (
                <span className="block mt-4 animate-fadeIn">
                  <span className="text-teal">L</span>
                  <span className="text-white">OCALS</span>
                </span>
              )}
            </h1>

            {showCloseButton && (
              <button
                onClick={() => setShowGYMTLOverlay(false)}
                className="mt-8 px-8 py-4 bg-teal text-white font-bold text-xl rounded-lg hover:bg-teal-light transition-all duration-300 hover:scale-110 shadow-lg animate-fadeIn"
              >
                Enter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
