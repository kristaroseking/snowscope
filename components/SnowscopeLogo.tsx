export default function SnowscopeLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 45"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vertical line on the left - gradient from teal to purple to blue */}
      <defs>
        <linearGradient id="verticalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#20B2AA" />
          <stop offset="50%" stopColor="#9370DB" />
          <stop offset="100%" stopColor="#4169E1" />
        </linearGradient>
      </defs>
      <rect x="0" y="10" width="5" height="32" fill="url(#verticalGradient)" rx="2" />

      {/* "SNOWSCOPE" text with retro monospace style */}
      <text
        x="15"
        y="35"
        fontFamily="'Space Mono', 'Courier New', monospace"
        fontWeight="700"
        fontSize="28"
        fill="#FFFFFF"
        letterSpacing="1"
      >
        <tspan fill="#FFFFFF">S</tspan>
        <tspan fill="#FFFFFF">N</tspan>
        <tspan fill="#FFFFFF">O</tspan>
        <tspan fill="#FFFFFF">W</tspan>
        <tspan fill="#FFFFFF">S</tspan>
        <tspan fill="#FFFFFF">C</tspan>
        <tspan fill="#FFFFFF">O</tspan>
        <tspan fill="#FFFFFF">P</tspan>
        <tspan fill="#FFFFFF">E</tspan>
      </text>
    </svg>
  );
}
