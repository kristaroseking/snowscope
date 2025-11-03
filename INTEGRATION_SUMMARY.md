# Weather Data Integration Summary

## What's Been Implemented

I've successfully set up the infrastructure to integrate all 4 weather data sources you requested for your Snowline app:

### 1. ✅ Weather Underground (Birdcage Station) - READY
**Location**: `lib/services/wunderground.ts`
**Status**: Framework ready, needs API key or scraping implementation
**What it does**:
- Fetches real-time data from personal weather stations
- Most accurate for on-mountain conditions
- Requires either enterprise API key or HTML scraping

**Next steps**:
- Get enterprise API key from Weather Underground, OR
- Implement web scraping from wunderground.com/dashboard/pws/{stationId}

### 2. ✅ GFS Model (via Open-Meteo instead of Pivotal) - WORKING
**Location**: `lib/services/pivotalWeather.ts`
**Status**: Fully functional, FREE, no API key required
**What it does**:
- 7-day forecasts from GFS model
- Same model data as Pivotal Weather shows
- Also includes HRRR (high-res 48hr), ECMWF, NAM, GEFS ensemble

**Why Open-Meteo**: Pivotal Weather doesn't have a public API. Open-Meteo provides free access to the same GFS/HRRR model data that Pivotal uses.

**Try it**: Already working! Uses https://api.open-meteo.com/

### 3. ✅ NOAA Weather API - WORKING
**Location**: `lib/services/noaa.ts`
**Status**: Fully functional, FREE, no API key required
**What it does**:
- Official NWS forecasts
- Current observations from weather stations
- Gridded forecast data (high resolution)
- Point forecasts for any location

**Try it**: Already working! Uses https://api.weather.gov/

### 4. ✅ NWS RFC Snow Pages - READY
**Location**: `lib/services/nwsRfc.ts`
**Status**: Framework ready, needs HTML scraping implementation
**What it does**:
- Snow depth measurements
- Snow Water Equivalent (SWE)
- Basin-wide precipitation data
- 24hr/48hr/72hr snowfall totals

**RFC Regions Configured**:
- NERFC (Northeast) - for Vermont resorts
- CBRFC (Colorado Basin) - for Telluride
- CNRFC (California/Nevada) - for Mammoth
- NWRFC (Northwest) - for future Pacific Northwest resorts

**Next steps**: Implement HTML scraping with Cheerio library

## The Aggregator

**Location**: `lib/services/weatherAggregator.ts`

This is the magic sauce that combines all data sources intelligently:

```typescript
import { aggregateWeatherData } from '@/lib/services/weatherAggregator';

const weather = await aggregateWeatherData(resort, {
  wunderground: { stationId: 'KVTSTOW123' } // optional
});

// Returns combined data from:
// - NOAA (official forecasts)
// - GFS/HRRR models (7-day predictions)
// - Wunderground (if configured)
// - RFC snow data (if available)
```

**Priority System**:
1. Wunderground (most local and accurate) - if available
2. HRRR (high-res 0-48 hours)
3. GFS (medium-range 3-7 days)
4. NOAA (official NWS forecasts)
5. RFC (snow-specific data)

## What's Working NOW (No Keys Needed!)

You can start using real data immediately for:

### Free Data Sources (Working Now):
- ✅ **NOAA**: Official forecasts, observations
- ✅ **GFS Model**: 7-day forecasts with hourly resolution
- ✅ **HRRR Model**: 48-hour high-resolution forecasts
- ✅ **Open-Meteo**: Access to multiple weather models

### Testing Real Data:

Visit: `http://localhost:3001/api/weather/test`

This endpoint fetches live data for Stowe and shows you what sources are working.

## What Needs Implementation

### Weather Underground:
**Option A - Enterprise API** (Recommended if budget allows):
- Contact Weather Underground for API pricing
- Add API key to `.env.local`
- Code is ready, just needs the key

**Option B - Web Scraping** (Free but requires maintenance):
- Install Puppeteer: `npm install puppeteer`
- Scrape from wunderground.com/dashboard/pws/{stationId}
- Parse HTML tables for current conditions
- Update every 5-10 minutes

### NWS RFC Snow Pages:
**Implementation Steps**:
1. Install Cheerio: `npm install cheerio @types/cheerio`
2. For each RFC region, scrape their snow pages:
   - NERFC: https://www.weather.gov/nerfc/snowfall
   - CBRFC: https://www.cbrfc.noaa.gov/
   - etc.
3. Parse HTML tables for snow depth, SWE, precipitation
4. Cache data (updates once per day)

**Example RFC Scraping**:
```typescript
import * as cheerio from 'cheerio';

async function scrapeNERFCSnow() {
  const response = await fetch('https://www.weather.gov/nerfc/snowfall');
  const html = await response.text();
  const $ = cheerio.load(html);

  // Parse tables and extract data
  // Each RFC has different structure
}
```

## Elevation Adjustment

Built-in function adjusts weather data for different elevations:

```typescript
import { adjustForElevation } from '@/lib/services/weatherAggregator';

const baseData = await aggregateWeatherData(resort);

// Get summit conditions (automatic temp/snow adjustment)
const summitData = adjustForElevation(
  baseData,
  resort.elevations.base,
  resort.elevations.summit
);
```

**Adjustments Applied**:
- Temperature: -3.5°F per 1,000 ft elevation gain
- Snow accumulation: +10-20% at higher elevations
- Wind: Generally higher at summit (future enhancement)

## File Structure

```
lib/
├── services/
│   ├── weatherAggregator.ts    # Main aggregator (combines all sources)
│   ├── noaa.ts                  # NOAA/NWS integration (working)
│   ├── pivotalWeather.ts        # GFS/HRRR via Open-Meteo (working)
│   ├── wunderground.ts          # PWS stations (needs implementation)
│   └── nwsRfc.ts               # RFC snow data (needs scraping)
├── weatherSources.ts            # Type definitions
├── resorts.ts                   # Resort configuration
└── mockData.ts                  # Fallback mock data

app/api/weather/
├── route.ts                     # All resorts endpoint
├── [resortId]/route.ts         # Single resort endpoint
└── test/route.ts               # Test endpoint for debugging
```

## Documentation

📖 **Complete integration guide**: `WEATHER_SOURCES.md`
- Detailed API documentation
- Rate limits and costs
- Example usage for each source
- Troubleshooting tips

🔧 **Developer guide**: `CLAUDE.md` (updated)
- How to add weather sources
- Testing strategies
- Common patterns

## Next Steps - Priority Order

### 1. Test Current Implementation (5 minutes)
```bash
# Visit the test endpoint
curl http://localhost:3001/api/weather/test

# Or open in browser to see JSON response
```

### 2. Add Real Data to Main Endpoints (Medium Priority)
Update `app/api/weather/route.ts` and `app/api/weather/[resortId]/route.ts` to use `aggregateWeatherData()` instead of mock data.

### 3. Implement Weather Underground (If Desired)
Choose API or scraping approach and implement in `lib/services/wunderground.ts`

### 4. Implement RFC Snow Scraping (Lower Priority)
Install Cheerio and build scrapers for RFC regions in `lib/services/nwsRfc.ts`

### 5. Add Caching Layer (Important for Production)
Implement Redis or in-memory caching to avoid hitting APIs too frequently:
```typescript
// Cache weather data for 10-15 minutes
// Rate limit: 1 update per resort per 10 min
```

### 6. Error Handling & Fallbacks
Add robust error handling with fallback to mock data when APIs fail

## Cost Analysis

| Source | Monthly Cost | API Key | Rate Limit |
|--------|-------------|---------|------------|
| NOAA | FREE | No | ~1 req/sec |
| Open-Meteo (GFS/HRRR) | FREE | No | 10,000/day |
| Weather Underground | ~$500-1000/month | Yes | Varies |
| RFC Scraping | FREE | No | Be respectful |

**Recommendation**: Start with free sources (NOAA + Open-Meteo). Add WU only if you need specific station data that justifies the cost.

## Questions?

- See `WEATHER_SOURCES.md` for detailed API documentation
- Test endpoint: http://localhost:3001/api/weather/test
- All code is documented with inline comments
