interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({ message = "Failed to load weather data" }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center bg-red-900/20 rounded-card p-8 max-w-md border border-red-700/50">
        <div className="text-red-400 text-5xl mb-4">⚠</div>
        <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Data</h3>
        <p className="text-slate-300 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
