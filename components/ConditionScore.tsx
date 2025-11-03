"use client";

import { useEffect, useState } from "react";
import { CurrentConditions } from "@/types";
import type { SkiConditionRatingResponse } from "@/types/scoring";

interface ConditionScoreProps {
  elevation: "base" | "mid" | "summit";
  conditions: CurrentConditions;
}

export default function ConditionScore({ elevation, conditions }: ConditionScoreProps) {
  const [scoreData, setScoreData] = useState<SkiConditionRatingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function fetchScore() {
      setLoading(true);
      setError(null);

      try {
        // Use real snow depth from current conditions, fallback to 0 if not available
        const baseDepth = conditions.snowDepth || 0;

        const response = await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            temperature: conditions.temp,
            feels_like: conditions.feelsLike,
            wind_speed: conditions.windSpeed,
            humidity: conditions.humidity || 65,
            precipitation: 0,
            base_depth: baseDepth,
            new_snow_24h: conditions.snowfall24h,
            snow_quality: conditions.snowfall24h > 10 ? "blower powder" :
                         conditions.snowfall24h > 5 ? "regular density snow" : "packed powder",
            surface_condition: "groomed"
          })
        });

        const result = await response.json();
        if (result.success && result.data) {
          setScoreData(result.data);
        } else {
          setError("Failed to load score");
        }
      } catch (err) {
        console.error('Error fetching score:', err);
        setError("Failed to load score");
      } finally {
        setLoading(false);
      }
    }

    fetchScore();
  }, [conditions, elevation]);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
          <div className="h-32 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !scoreData) {
    return null; // Silently fail - don't show error to user
  }

  const score = Math.round(scoreData.overall_score);

  // Determine color scheme based on score (red, yellow, green)
  let scoreColor = "text-red-400 bg-red-500/20 border-red-500/30"; // Poor (0-49)
  let scoreBgGradient = "from-red-500/10 to-red-500/5";

  if (score >= 70) {
    scoreColor = "text-green-400 bg-green-500/20 border-green-500/30"; // Great (70-100)
    scoreBgGradient = "from-green-500/10 to-green-500/5";
  } else if (score >= 50) {
    scoreColor = "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"; // Fair/Good (50-69)
    scoreBgGradient = "from-yellow-500/10 to-yellow-500/5";
  }

  const elevationName = elevation === "base" ? "Base" : elevation === "mid" ? "Mid Mountain" : "Summit";

  return (
    <div className={`bg-gradient-to-br ${scoreBgGradient} rounded-card shadow-lg border-2 ${scoreColor.split(' ')[2]} mb-6 overflow-hidden`}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="text-left flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold text-white">
                {elevationName} Ski Conditions Score
              </h3>
              <span className="text-slate-400">
                {isExpanded ? "▼" : "▶"}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              {scoreData.details.conditions_summary}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Rating Badge */}
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${scoreColor.split(' ')[0]}`}>
                {scoreData.rating}
              </span>
            </div>
            {/* Score */}
            <div className={`px-6 py-3 rounded-lg text-4xl font-bold border-2 ${scoreColor}`}>
              {score}
            </div>
          </div>
        </div>
      </button>

      {/* Expandable Component Breakdown */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-slate-600/50 pt-6">
        <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
          Score Breakdown
        </h4>

        {/* New Snow */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">❄️</span>
              <span className="text-sm font-medium text-slate-300">New Snow (24h)</span>
            </div>
            <span className="text-sm font-bold text-white">
              {Math.round(scoreData.component_scores.new_snow.percentage)}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                scoreData.component_scores.new_snow.percentage >= 70 ? 'bg-green-400' :
                scoreData.component_scores.new_snow.percentage >= 50 ? 'bg-yellow-400' :
                'bg-red-400'
              }`}
              style={{ width: `${scoreData.component_scores.new_snow.percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {conditions.snowfall24h}" of fresh snow in last 24 hours • 40% weight
          </p>
        </div>

        {/* Snow Depth */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📏</span>
              <span className="text-sm font-medium text-slate-300">Base Depth</span>
            </div>
            <span className="text-sm font-bold text-white">
              {Math.round(scoreData.component_scores.snow_depth.percentage)}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                scoreData.component_scores.snow_depth.percentage >= 70 ? 'bg-green-400' :
                scoreData.component_scores.snow_depth.percentage >= 50 ? 'bg-yellow-400' :
                'bg-red-400'
              }`}
              style={{ width: `${scoreData.component_scores.snow_depth.percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Overall snow base coverage • 15% weight
          </p>
        </div>

        {/* Snow Quality */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium text-slate-300">Snow Quality</span>
            </div>
            <span className="text-sm font-bold text-white">
              {Math.round(scoreData.component_scores.snow_quality.percentage)}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                scoreData.component_scores.snow_quality.percentage >= 70 ? 'bg-green-400' :
                scoreData.component_scores.snow_quality.percentage >= 50 ? 'bg-yellow-400' :
                'bg-red-400'
              }`}
              style={{ width: `${scoreData.component_scores.snow_quality.percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {conditions.snowfall24h > 10 ? "Blower powder conditions" :
             conditions.snowfall24h > 5 ? "Regular density snow" : "Packed powder surface"} • 15% weight
          </p>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌡️</span>
              <span className="text-sm font-medium text-slate-300">Temperature</span>
            </div>
            <span className="text-sm font-bold text-white">
              {Math.round(scoreData.component_scores.temperature.percentage)}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                scoreData.component_scores.temperature.percentage >= 70 ? 'bg-green-400' :
                scoreData.component_scores.temperature.percentage >= 50 ? 'bg-yellow-400' :
                'bg-red-400'
              }`}
              style={{ width: `${scoreData.component_scores.temperature.percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {conditions.temp}°F (feels like {conditions.feelsLike}°F) • 15% weight
          </p>
        </div>

        {/* Wind */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">💨</span>
              <span className="text-sm font-medium text-slate-300">Wind Conditions</span>
            </div>
            <span className="text-sm font-bold text-white">
              {Math.round(scoreData.component_scores.wind.percentage)}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                scoreData.component_scores.wind.percentage >= 70 ? 'bg-green-400' :
                scoreData.component_scores.wind.percentage >= 50 ? 'bg-yellow-400' :
                'bg-red-400'
              }`}
              style={{ width: `${scoreData.component_scores.wind.percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {conditions.windSpeed} mph winds • 15% weight
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <p className="text-xs text-slate-500 italic">
            Score calculated using Python-based ski condition algorithm
          </p>
        </div>
      </div>
      )}
    </div>
  );
}
