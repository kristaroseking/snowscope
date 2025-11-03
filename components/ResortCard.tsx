import Link from "next/link";
import { ResortWeather } from "@/types";

interface ResortCardProps {
  weather: ResortWeather;
}

export default function ResortCard({ weather }: ResortCardProps) {
  const { resort, current } = weather;

  return (
    <Link href={`/resort/${resort.id}`}>
      <div className="bg-white rounded-card shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer border border-slate-200 hover:border-slate-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-primary leading-tight">{resort.name}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {resort.state}, {resort.country}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary tabular-nums">
              {current.mid.temp}°
            </div>
            <div className="text-xs text-slate-500 mt-1">Mid Mountain</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-powder/20 rounded-lg p-3">
            <div className="text-xs text-slate-600 mb-1">24h Snow</div>
            <div className="text-lg font-bold text-primary tabular-nums">
              {current.mid.snowfall24h}&quot;
            </div>
          </div>
          <div className="bg-powder/20 rounded-lg p-3">
            <div className="text-xs text-slate-600 mb-1">48h Snow</div>
            <div className="text-lg font-bold text-primary tabular-nums">
              {current.mid.snowfall48h}&quot;
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-600 mb-1">Wind</div>
            <div className="text-lg font-bold text-slate-700 tabular-nums">
              {current.mid.windSpeed}
            </div>
            <div className="text-xs text-slate-500">mph</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            {current.mid.weatherDescription}
          </div>
          <div className="text-accent text-sm font-medium hover:text-accent/80 transition-colors">
            View Forecast →
          </div>
        </div>
      </div>
    </Link>
  );
}
