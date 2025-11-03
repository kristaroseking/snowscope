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

interface HourlyNewSnowCardProps {
  hourData: HourData | null;
}

export default function HourlyNewSnowCard({ hourData }: HourlyNewSnowCardProps) {
  if (!hourData) {
    return null;
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-700 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Hourly Snowfall</h3>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-slate-400 mb-2">{hourData.time}</div>
          <div className="text-5xl font-bold text-teal-light tabular-nums">
            {hourData.snowAccumulation > 0 ? hourData.snowAccumulation.toFixed(1) : '0.0'}&quot;
          </div>
          <div className="text-sm text-slate-400 mt-1">Hourly Accumulation</div>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-2">Conditions</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{hourData.weatherDescription}</span>
            <span className="text-sm text-slate-300">{hourData.temp}°F</span>
          </div>
        </div>
      </div>
    </div>
  );
}
