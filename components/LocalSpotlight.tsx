import { LocalSpotlight as LocalSpotlightType } from "@/lib/localSpotlights";

interface LocalSpotlightProps {
  spotlight: LocalSpotlightType;
}

const typeLabels = {
  restaurant: "Local Eats",
  program: "Community Program",
  store: "Local Shop",
  project: "Community Project",
  hero: "Local Hero",
};

const typeColors = {
  restaurant: "from-teal/20 to-purple/20 border-teal/30",
  program: "from-purple/20 to-royal/20 border-purple/30",
  store: "from-royal/20 to-teal/20 border-royal/30",
  project: "from-teal/20 to-royal/20 border-teal/30",
  hero: "from-purple/20 to-teal/20 border-purple/30",
};

export default function LocalSpotlight({ spotlight }: LocalSpotlightProps) {
  return (
    <div
      className={`bg-gradient-to-br ${typeColors[spotlight.type]} border rounded-card p-6`}
    >
      <div className="flex items-start gap-4 mb-4">
        <span className="text-4xl flex-shrink-0">{spotlight.icon}</span>
        <div className="flex-1">
          <div className="text-xs font-semibold text-teal-light uppercase tracking-wide mb-1">
            {typeLabels[spotlight.type]}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {spotlight.name}
          </h3>
        </div>
      </div>

      <p className="text-slate-300 leading-relaxed mb-4">
        {spotlight.description}
      </p>

      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0">✨</span>
          <div>
            <div className="text-xs font-semibold text-white uppercase tracking-wide mb-1">
              Why We Love It
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              {spotlight.highlight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
