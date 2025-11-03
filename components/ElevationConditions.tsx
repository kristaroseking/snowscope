import { CurrentConditions } from "@/types";

interface ElevationConditionsProps {
  elevation: string;
  elevationFeet: number;
  conditions: CurrentConditions;
}

export default function ElevationConditions({
  elevation,
  elevationFeet,
  conditions,
}: ElevationConditionsProps) {
  return (
    <div className="bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{elevation}</h3>
          <p className="text-sm text-slate-400 mt-1">{elevationFeet.toLocaleString()} ft</p>
        </div>
        <div className="flex items-center gap-6">
          {/* Temperature */}
          <div className="text-right">
            <div className="text-4xl font-bold text-white tabular-nums">{conditions.temp}°</div>
            <div className="text-sm text-slate-400 mt-1">Feels like {conditions.feelsLike}°</div>
          </div>

          {/* Base Depth */}
          <div className="text-right border-l border-slate-600 pl-6">
            <div className="text-4xl font-bold text-teal-light tabular-nums">
              {conditions.snowDepth !== undefined && conditions.snowDepth > 0
                ? `${conditions.snowDepth}"`
                : 'N/A'}
            </div>
            <div className="text-sm text-slate-400 mt-1">Base Depth</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="text-xs text-slate-300 mb-1">24h Snowfall</div>
          <div className="text-2xl font-bold text-teal-light tabular-nums">
            {conditions.snowfall24h}&quot;
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="text-xs text-slate-300 mb-1">48h Snowfall</div>
          <div className="text-2xl font-bold text-teal-light tabular-nums">
            {conditions.snowfall48h}&quot;
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">Wind Speed</div>
          <div className="text-lg font-semibold text-slate-200 tabular-nums">
            {conditions.windSpeed} mph
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Visibility</div>
          <div className="text-lg font-semibold text-slate-200 tabular-nums">
            {conditions.visibility} mi
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Conditions</div>
          <div className="text-sm font-medium text-slate-200">
            {conditions.weatherDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
