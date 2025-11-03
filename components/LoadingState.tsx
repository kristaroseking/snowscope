export default function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          className="mx-auto mb-4"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <animate attributeName="x1" values="0%;100%;0%" dur="2s" repeatCount="indefinite" />
              <animate attributeName="y1" values="0%;100%;0%" dur="1.5s" repeatCount="indefinite" />
              <stop offset="0%" style={{ stopColor: '#5eead4', stopOpacity: 1 }}>
                <animate attributeName="stop-color" values="#5eead4;#c084fc;#fb923c;#fbbf24;#22c55e;#ef4444;#5eead4" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="33%" style={{ stopColor: '#c084fc', stopOpacity: 1 }}>
                <animate attributeName="stop-color" values="#c084fc;#fb923c;#fbbf24;#22c55e;#ef4444;#5eead4;#c084fc" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="66%" style={{ stopColor: '#fb923c', stopOpacity: 1 }}>
                <animate attributeName="stop-color" values="#fb923c;#fbbf24;#22c55e;#ef4444;#5eead4;#c084fc;#fb923c" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }}>
                <animate attributeName="stop-color" values="#fbbf24;#22c55e;#ef4444;#5eead4;#c084fc;#fb923c;#fbbf24" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <animate attributeName="x1" values="100%;0%;100%" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="y1" values="0%;100%;0%" dur="2.2s" repeatCount="indefinite" />
              <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 1 }}>
                <animate attributeName="stop-color" values="#c084fc;#22c55e;#fb923c;#ef4444;#fbbf24;#5eead4;#c084fc" dur="2.5s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" style={{ stopColor: '#22c55e', stopOpacity: 1 }}>
                <animate attributeName="stop-color" values="#22c55e;#fb923c;#ef4444;#fbbf24;#5eead4;#c084fc;#22c55e" dur="2.5s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }}>
                <animate attributeName="stop-color" values="#ef4444;#fbbf24;#5eead4;#c084fc;#22c55e;#fb923c;#ef4444" dur="2.5s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <radialGradient id="grad3" cx="50%" cy="50%">
              <animate attributeName="cx" values="50%;30%;70%;50%" dur="3s" repeatCount="indefinite" />
              <animate attributeName="cy" values="50%;70%;30%;50%" dur="4s" repeatCount="indefinite" />
              <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }}>
                <animate attributeName="stop-color" values="#fbbf24;#ef4444;#c084fc;#5eead4;#fbbf24" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" style={{ stopColor: '#c084fc', stopOpacity: 0.5 }}>
                <animate attributeName="stop-color" values="#c084fc;#22c55e;#fb923c;#ef4444;#c084fc" dur="2s" repeatCount="indefinite" />
              </stop>
            </radialGradient>
          </defs>

          {/* Outer rotating layer */}
          <g className="animate-spin origin-center" style={{ animationDuration: '5s' }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke="url(#grad1)" strokeWidth="3" opacity="0.6" />
            <circle cx="80" cy="30" r="14" fill="url(#grad1)" opacity="0.9">
              <animate attributeName="r" values="14;18;14" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="130" cy="80" r="14" fill="url(#grad2)" opacity="0.9">
              <animate attributeName="r" values="14;18;14" begin="0.3s" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="130" r="14" fill="url(#grad3)" opacity="0.9">
              <animate attributeName="r" values="14;18;14" begin="0.6s" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="30" cy="80" r="14" fill="url(#grad1)" opacity="0.9">
              <animate attributeName="r" values="14;18;14" begin="0.9s" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Middle counter-rotating layer */}
          <g className="origin-center" style={{ animation: 'spin 3.5s linear infinite reverse' }}>
            <circle cx="80" cy="80" r="50" fill="none" stroke="url(#grad2)" strokeWidth="4" opacity="0.7" />
            <polygon points="80,30 100,55 80,50 60,55" fill="url(#grad3)" opacity="0.8" />
            <polygon points="130,80 105,100 110,80 105,60" fill="url(#grad1)" opacity="0.8" />
            <polygon points="80,130 60,105 80,110 100,105" fill="url(#grad2)" opacity="0.8" />
            <polygon points="30,80 55,60 50,80 55,100" fill="url(#grad3)" opacity="0.8" />
          </g>

          {/* Inner fast spinning layer */}
          <g className="animate-spin origin-center" style={{ animationDuration: '2s' }}>
            <circle cx="80" cy="80" r="30" fill="none" stroke="url(#grad3)" strokeWidth="5" opacity="0.9" strokeDasharray="8,4" />
            <circle cx="80" cy="50" r="10" fill="url(#grad1)">
              <animate attributeName="r" values="10;15;10" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="110" cy="80" r="10" fill="url(#grad2)">
              <animate attributeName="r" values="10;15;10" begin="0.25s" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="110" r="10" fill="url(#grad3)">
              <animate attributeName="r" values="10;15;10" begin="0.5s" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="80" r="10" fill="url(#grad1)">
              <animate attributeName="r" values="10;15;10" begin="0.75s" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Center pulsing core */}
          <g>
            <circle cx="80" cy="80" r="18" fill="url(#grad3)" opacity="0.9">
              <animate attributeName="r" values="18;25;18" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="80" r="10" fill="url(#grad2)">
              <animate attributeName="r" values="10;15;10" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="80" r="5" fill="url(#grad1)">
              <animate attributeName="r" values="5;8;5" dur="0.6s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Subtle ski poles - crossed in center */}
          <g opacity="0.15">
            {/* Left pole */}
            <line x1="65" y1="95" x2="75" y2="65" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="75" cy="65" r="2.5" fill="#94a3b8" />
            <polygon points="64,96 65,95 66,96" fill="#94a3b8" />

            {/* Right pole */}
            <line x1="95" y1="95" x2="85" y2="65" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="85" cy="65" r="2.5" fill="#94a3b8" />
            <polygon points="94,96 95,95 96,96" fill="#94a3b8" />
          </g>

          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </svg>
        <p className="text-slate-300 leading-relaxed">Loading weather data...</p>
      </div>
    </div>
  );
}
