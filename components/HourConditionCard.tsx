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

interface HourConditionCardProps {
  hourData: HourData | null;
}

export default function HourConditionCard({ hourData }: HourConditionCardProps) {
  if (!hourData) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-700 h-32 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Hover over the rating bar to see hour details</p>
      </div>
    );
  }

  const getScoreColor = (score: number, rating?: string) => {
    if (rating === "GO_SURFING") return "text-gray-500";
    if (score >= 80) return "text-emerald-500";
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-lime-400";
    if (score >= 30) return "text-orange-400";
    return "text-red-500";
  };

  const getWindDirectionLabel = (degrees?: number) => {
    if (degrees === undefined) return "N/A";
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-lg font-bold text-white">{hourData.time}</h4>
          <p className={`text-sm font-semibold ${getScoreColor(hourData.score, hourData.rating)}`}>
            {hourData.rating === "GO_SURFING" ? "Go Surfing" : hourData.rating} ({hourData.score}/100)
          </p>
        </div>
        <div className="text-2xl">{hourData.weatherDescription}</div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <div className="text-xs text-slate-400 mb-1">Temp</div>
          <div className="text-lg font-bold text-white tabular-nums">{hourData.temp}°</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Snow</div>
          <div className="text-lg font-bold text-teal-light tabular-nums">
            {hourData.snowAccumulation > 0 ? `${hourData.snowAccumulation.toFixed(1)}"` : '0"'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Wind</div>
          <div className="text-lg font-bold text-slate-200 tabular-nums">{hourData.windSpeed} mph</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Direction</div>
          <div className="text-lg font-bold text-slate-200">{getWindDirectionLabel(hourData.windDirection)}</div>
        </div>
      </div>
    </div>
  );
}
