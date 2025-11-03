import ResortCard from "./ResortCard";
import { ResortWeather } from "@/types";
import { Region } from "@/types";

interface RegionSectionProps {
  region: Region;
  resorts: ResortWeather[];
}

export default function RegionSection({ region, resorts }: RegionSectionProps) {
  if (resorts.length === 0) return null;

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary tracking-tight">
          {region}
        </h2>
        <div className="h-1 w-16 bg-accent rounded-full mt-3"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resorts.map((weather) => (
          <ResortCard key={weather.resort.id} weather={weather} />
        ))}
      </div>
    </section>
  );
}
