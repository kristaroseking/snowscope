"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import ResortForecastRow from "@/components/ResortForecastRow";
import SnowscopeLogo from "@/components/SnowscopeLogo";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { ResortWeather, Region } from "@/types";

// Dynamically import the map to avoid SSR issues
const ResortMap = dynamic(() => import("@/components/ResortMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 rounded-card border border-slate-200 flex items-center justify-center">
      <p className="text-slate-500">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const [weatherData, setWeatherData] = useState<ResortWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | "All">("All");
  const [selectedPass, setSelectedPass] = useState<"All" | "Epic" | "Ikon" | "Indy" | "Independent">("All");
  const [selectedTab, setSelectedTab] = useState<"resorts" | "backcountry" | "trip-planning" | "map-view">("resorts");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch("/api/weather");
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
    }

    fetchWeather();
  }, []);

  // Filter resorts by selected region and pass
  const filteredWeatherData = useMemo(() => {
    let filtered = weatherData;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((weather) =>
        weather.resort.name.toLowerCase().includes(query) ||
        weather.resort.state.toLowerCase().includes(query) ||
        weather.resort.country.toLowerCase().includes(query)
      );
    }

    // Filter by region
    if (selectedRegion !== "All") {
      filtered = filtered.filter((weather) => weather.resort.region === selectedRegion);
    }

    // Filter by pass
    if (selectedPass !== "All") {
      filtered = filtered.filter((weather) => {
        // If filtering for "Independent", show resorts with no passes OR passes that include "Independent"
        if (selectedPass === "Independent") {
          return !weather.resort.passes || weather.resort.passes.length === 0 || weather.resort.passes.includes("Independent");
        }
        // For other passes, check if the resort has that pass
        return weather.resort.passes?.includes(selectedPass);
      });
    }

    return filtered;
  }, [weatherData, selectedRegion, selectedPass, searchQuery]);

  // Get all resorts for the map
  const allResorts = useMemo(() => {
    return weatherData.map((weather) => weather.resort);
  }, [weatherData]);

  // Define region options
  const regions: (Region | "All")[] = [
    "All",
    "Northeast USA",
    "Western USA",
    "Canada",
    "International",
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="sr-only">Snowscope</h1>
          <SnowscopeLogo className="h-12 w-auto" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs with Most Snow Banner */}
        <div className="mb-8 border-b border-slate-700 -mx-4 sm:mx-0">
          <div className="overflow-x-auto scrollbar-hide px-4 sm:px-0">
            <div className="flex gap-4 sm:gap-8 min-w-max sm:min-w-0">
              <button
                onClick={() => setSelectedTab("resorts")}
                className={`pb-4 px-2 text-base sm:text-lg font-semibold transition-all relative whitespace-nowrap ${
                  selectedTab === "resorts"
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Resorts
                {selectedTab === "resorts" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setSelectedTab("backcountry")}
                className={`pb-4 px-2 text-base sm:text-lg font-semibold transition-all relative whitespace-nowrap ${
                  selectedTab === "backcountry"
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Backcountry
                {selectedTab === "backcountry" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setSelectedTab("trip-planning")}
                className={`pb-4 px-2 text-base sm:text-lg font-semibold transition-all relative whitespace-nowrap ${
                  selectedTab === "trip-planning"
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Trip Planning
                {selectedTab === "trip-planning" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setSelectedTab("map-view")}
                className={`pb-4 px-2 text-base sm:text-lg font-semibold transition-all relative whitespace-nowrap ${
                  selectedTab === "map-view"
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Map View
                {selectedTab === "map-view" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!loading && !error && (
          <>
            {selectedTab === "resorts" && (
              <>
                {/* Filters Section */}
                <div className="mb-8">
                  {/* Search Box and Most Snow Banner - Side by side on desktop, stacked on mobile */}
                  <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    {/* Search Box */}
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search resorts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                      />
                    </div>

                    {/* Most Snow Banner */}
                    {(() => {
                      const filteredData = selectedRegion === "All"
                        ? weatherData
                        : weatherData.filter((data) => data.resort.region === selectedRegion);

                      if (filteredData.length === 0) return null;

                      const resortSnowTotals = filteredData.map((data) => {
                        const totalSnow = data.forecast.mid.reduce(
                          (sum, day) => sum + day.snowAccumulation,
                          0
                        );
                        return { resort: data.resort, totalSnow };
                      });

                      const topResort = resortSnowTotals.reduce((max, current) =>
                        current.totalSnow > max.totalSnow ? current : max
                      );

                      if (topResort.totalSnow > 0) {
                        return (
                          <a
                            href={`/resort/${topResort.resort.id}`}
                            className="flex items-center gap-2 px-3 py-2 bg-teal/10 hover:bg-teal/20 border border-teal/30 rounded-lg transition-all whitespace-nowrap"
                          >
                            <span className="text-lg">⭐</span>
                            <div className="text-left">
                              <p className="text-xs text-slate-400">Most snow</p>
                              <p className="text-sm text-white font-medium">
                                {topResort.resort.name} <span className="text-teal-light">{topResort.totalSnow.toFixed(0)}"</span>
                              </p>
                            </div>
                          </a>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  {/* Mobile: Compact dropdown filters */}
                  <div className="lg:hidden space-y-3 mb-6">
                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">
                        Geographic Region
                      </label>
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value as Region | "All")}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                      >
                        {regions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">
                        Mountain Daddy
                      </label>
                      <select
                        value={selectedPass}
                        onChange={(e) => setSelectedPass(e.target.value as "All" | "Epic" | "Ikon" | "Indy" | "Independent")}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                      >
                        {(["All", "Epic", "Ikon", "Indy", "Independent"] as const).map((pass) => (
                          <option key={pass} value={pass}>
                            {pass}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Desktop: Button filters (hidden on mobile) */}
                  <div className="hidden lg:block">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Geographic Region Section */}
                        <div className="mb-6">
                          <h2 className="text-xs text-slate-400 uppercase tracking-wide mb-3">
                            Geographic Region
                          </h2>
                          <div className="flex gap-3 flex-wrap">
                            {regions.map((region) => (
                              <button
                                key={region}
                                onClick={() => setSelectedRegion(region)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  selectedRegion === region
                                    ? "bg-teal text-slate-900 shadow-lg"
                                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600"
                                }`}
                              >
                                {region}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Mountain Daddy Section */}
                        <div>
                          <h2 className="text-xs text-slate-400 uppercase tracking-wide mb-3">
                            Mountain Daddy
                          </h2>
                          <div className="flex gap-3 flex-wrap">
                            {(["All", "Epic", "Ikon", "Indy", "Independent"] as const).map((pass) => (
                              <button
                                key={pass}
                                onClick={() => setSelectedPass(pass)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  selectedPass === pass
                                    ? "bg-purple-dark text-white shadow-lg"
                                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600"
                                }`}
                              >
                                {pass}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 10-Day Forecasts */}
                <div className="space-y-4">
                  {filteredWeatherData.map((weatherData) => (
                    <ResortForecastRow
                      key={weatherData.resort.id}
                      weatherData={weatherData}
                    />
                  ))}
                  {filteredWeatherData.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      No resorts found for this region.
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedTab === "backcountry" && (
              <div className="bg-slate-800 rounded-card shadow-sm p-12 border border-slate-700">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Backcountry Coming Soon
                  </h2>
                  <p className="text-slate-300 text-lg">
                    We're working on adding backcountry conditions and forecasting.
                  </p>
                </div>
              </div>
            )}

            {selectedTab === "trip-planning" && (
              <div className="bg-slate-800 rounded-card shadow-sm p-12 border border-slate-700">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Trip Planning Coming Soon
                  </h2>
                  <p className="text-slate-300 text-lg">
                    We're working on tools to help you plan your perfect ski trip.
                  </p>
                </div>
              </div>
            )}

            {selectedTab === "map-view" && (
              <section>
                <ResortMap resorts={allResorts} />
              </section>
            )}
          </>
        )}
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-400 text-sm">
            Powered by NOAA, GFS, and HRRR weather models
          </p>
        </div>
      </footer>
    </div>
  );
}
