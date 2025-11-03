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

interface TotalDaySnowfallProps {
  hourData: HourData | null;
  allHourlyData: HourData[];
}

export default function TotalDaySnowfall({ hourData, allHourlyData }: TotalDaySnowfallProps) {
  if (!hourData) {
    return null;
  }

  // Calculate total snowfall up to current hour
  const totalSnowfall = allHourlyData
    .filter(h => h.hour <= hourData.hour)
    .reduce((sum, h) => sum + h.snowAccumulation, 0);

  return (
    <div className="flex flex-col justify-center">
      <div className="text-lg font-semibold text-white mb-4">Snow Total</div>
      <div>
        <div className="text-sm text-slate-400 mb-2">Total Accumulation</div>
        <div className="text-5xl font-bold text-teal-light tabular-nums">
          {totalSnowfall.toFixed(1)}&quot;
        </div>
        <div className="text-sm text-slate-400 mt-1">
          Through {(() => {
            const hour = hourData.hour;
            const period = hour >= 12 ? 'pm' : 'am';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            return `${displayHour}:00${period}`;
          })()}
        </div>
      </div>
    </div>
  );
}
