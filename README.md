# Snowline

A ski and snowboard weather forecast application inspired by Surfline's clean design. Get detailed weather conditions and forecasts for top mountain resorts.

## Features

- **Resort Overview**: View current conditions for all resorts at a glance
- **Detailed Forecasts**: 7-day snow accumulation forecasts with interactive charts
- **Elevation Data**: Separate conditions for base, mid-mountain, and summit elevations
- **Real-time Weather**: Current temperature, wind speed, snowfall, and visibility
- **Clean UI**: Minimalist blue/white design inspired by Surfline

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Weather Data**: OpenWeather API (currently using mock data)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd snowline
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenWeather API key to `.env.local`:
```
OPENWEATHER_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Current Resorts

### Northeast USA
- Stowe Mountain Resort, Vermont
- Mad River Glen, Vermont
- Jay Peak Resort, Vermont
- Sugarbush Resort, Vermont
- Killington Resort, Vermont
- Sunday River, Maine

### Western USA
- Mammoth Mountain, California
- Powder Mountain, Utah
- Taos Ski Valley, New Mexico
- Telluride Ski Resort, Colorado

### Canada
- Kicking Horse Mountain Resort, British Columbia
- Fernie Alpine Resort, British Columbia

### International
- Niseko United, Hokkaido, Japan
- Livigno Ski Area, Lombardy, Italy

## Project Structure

```
snowline/
├── app/
│   ├── api/
│   │   └── weather/          # API route handlers
│   ├── resort/[id]/          # Individual resort pages
│   └── page.tsx              # Home page
├── components/
│   ├── ResortCard.tsx        # Resort preview card
│   ├── ElevationConditions.tsx  # Current conditions display
│   ├── SnowForecastChart.tsx    # 7-day forecast chart
│   ├── LoadingState.tsx      # Loading spinner
│   └── ErrorState.tsx        # Error display
├── lib/
│   ├── resorts.ts            # Resort data configuration
│   └── mockData.ts           # Mock weather data generator
└── types/
    └── index.ts              # TypeScript type definitions
```

## Development Status

Currently using **mock data** for development. The OpenWeather API integration is ready but needs an API key to fetch real data.

### Next Steps

1. Add OpenWeather API key to environment variables
2. Implement real weather data fetching in API routes
3. Add more resorts
4. Implement user preferences and favorites
5. Add weather alerts and notifications

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
