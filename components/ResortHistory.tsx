import { ResortHistory as ResortHistoryType } from "@/lib/resortHistories";

interface ResortHistoryProps {
  resortName: string;
  history: ResortHistoryType;
}

export default function ResortHistory({ resortName, history }: ResortHistoryProps) {
  return (
    <div className="bg-slate-750 rounded-card shadow-sm p-6 border border-slate-600 h-fit sticky top-6" style={{ backgroundColor: '#2a3544' }}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📚</span>
          <h3 className="text-xl font-bold text-white">Resort History</h3>
        </div>
        <div className="text-sm text-teal-light font-semibold">
          Founded {history.founded}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {history.summary}
          </p>
        </div>

        <div className="bg-teal/10 border border-teal/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <div className="text-xs font-semibold text-teal-light mb-1 uppercase tracking-wide">
                Fun Fact
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {history.funFact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
