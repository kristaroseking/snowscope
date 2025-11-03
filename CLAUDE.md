# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Snowline is a Next.js 14 ski/snowboard weather forecast application inspired by Surfline's design. It displays current conditions and 7-day forecasts for mountain resorts with separate data for base, mid-mountain, and summit elevations.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (starts on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### App Router Structure
- **app/page.tsx**: Home page - client component that fetches and displays all resorts
- **app/resort/[id]/page.tsx**: Individual resort detail page with elevation tabs
- **app/api/weather/route.ts**: API route for all resort weather data
- **app/api/weather/[resortId]/route.ts**: API route for single resort weather data

### Data Flow
1. Client components fetch data from `/api/weather` endpoints
2. API routes can use either mock data or real weather sources
3. Real data is aggregated from multiple sources via `lib/services/weatherAggregator.ts`
4. All weather data uses TypeScript types defined in `types/index.ts`

### Weather Data Sources
The app integrates multiple weather data sources (see `WEATHER_SOURCES.md` for details):
- **NOAA Weather API**: Free, official NWS forecasts (fully implemented)
- **GFS Model**: Via Open-Meteo, 7-day forecasts (fully implemented)
- **HRRR Model**: Via Open-Meteo, 48-hour high-res forecasts (fully implemented)
- **Weather Underground**: Personal weather stations (stub, needs API key or scraping)
- **NWS RFC**: River Forecast Center snow data (stub, needs HTML scraping)

Data aggregation prioritizes: WU (if available) > HRRR > GFS > NOAA > RFC

### Key Components
- **ResortCard**: Displays resort summary on home page with current conditions
- **ElevationConditions**: Shows current weather for a specific elevation (base/mid/summit)
- **SnowForecastChart**: Recharts bar chart showing 7-day snow accumulation
- **LoadingState/ErrorState**: Reusable loading and error UI states

### Resort Configuration
Resorts are defined in `lib/resorts.ts` with:
- Unique ID (used in URLs)
- Name, location, coordinates
- Elevation data for base, mid, and summit

### Mock Data
`lib/mockData.ts` generates realistic weather data for development:
- Temperature adjusts based on elevation (colder at summit)
- Random snowfall and wind data
- 7-day forecasts for each elevation

## Styling

Uses Tailwind CSS with a blue/white color scheme:
- Primary blue: `blue-600` (#2563eb)
- Background: `blue-50` to white gradient
- Cards use `shadow-md` with `hover:shadow-lg` transitions

## TypeScript Types

All types in `types/index.ts`:
- **Resort**: Resort configuration data
- **CurrentConditions**: Real-time weather at an elevation
- **DailyForecast**: Single day forecast data
- **ElevationConditions/ElevationForecast**: Weather for base/mid/summit
- **ResortWeather**: Complete resort weather data structure

## Weather Data Integration

### Using Real Weather Data

Test endpoint to verify data sources: `/api/weather/test`

The app uses `lib/services/weatherAggregator.ts` to combine multiple sources:

```typescript
import { aggregateWeatherData } from '@/lib/services/weatherAggregator';

const resort = RESORTS.find(r => r.id === 'stowe');
const weather = await aggregateWeatherData(resort);
// Returns data from NOAA, GFS, HRRR automatically (all free, no keys needed)
```

### Data Source Services

Located in `lib/services/`:
- `noaa.ts`: NOAA/NWS API integration (working, free)
- `pivotalWeather.ts`: GFS/HRRR via Open-Meteo (working, free)
- `wunderground.ts`: PWS station data (stub, needs implementation)
- `nwsRfc.ts`: RFC snow data (stub, needs scraping)
- `weatherAggregator.ts`: Combines all sources with priority weighting

### Adding Weather Underground Stations

For resorts with nearby PWS stations:

```typescript
const weather = await aggregateWeatherData(resort, {
  wunderground: {
    stationId: 'KVTSTOW123',
    apiKey: process.env.WU_API_KEY // Optional
  }
});
```

See `WEATHER_SOURCES.md` for complete integration guide.

## Adding New Resorts

1. Add resort to `lib/resorts.ts` RESORTS array
2. Include coordinates and elevation data
3. Use kebab-case for ID (e.g., "park-city")
4. Mock data will automatically generate for new resorts

## Common Patterns

- All client components use "use client" directive
- API routes use Next.js 14 App Router conventions
- Loading states shown during fetch, errors handled gracefully
- Resort pages use `useParams()` to get dynamic route parameter
- Charts configured with Recharts ResponsiveContainer for responsive design
