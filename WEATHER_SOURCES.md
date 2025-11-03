# Weather Data Sources Integration

This document explains how Snowline integrates multiple weather data sources to provide accurate mountain weather forecasts.

## Data Sources Overview

### 1. Weather Underground (Wunderground)
**Status**: Stub implementation, needs completion
**Access**: Requires enterprise API key OR web scraping
**Use Case**: Personal weather station data (e.g., Birdcage station at Stowe)

**Features**:
- Real-time conditions from on-mountain weather stations
- Most accurate local data when stations are available
- Historical data access

**Implementation Notes**:
- WU deprecated their free API in 2018
- Enterprise API: Contact Weather Underground for pricing
- Alternative: Web scraping from `wunderground.com/dashboard/pws/{stationId}`
- Recommended library: Puppeteer or Cheerio for scraping

**Example Configuration**:
```typescript
wunderground: {
  stationId: "KVTSTOW123", // Your PWS ID
  apiKey: "your_enterprise_key" // Optional, for API access
}
```

### 2. NOAA Weather API
**Status**: ✅ Fully implemented
**Access**: Free, no API key required
**Use Case**: Official NWS forecasts and observations

**Features**:
- 7-day forecasts from NWS
- Gridpoint-based data (high resolution)
- Current observations from weather stations
- Free and reliable

**API Endpoints**:
- Points: `https://api.weather.gov/points/{lat},{lon}`
- Forecast: `https://api.weather.gov/gridpoints/{office}/{gridX},{gridY}/forecast`
- Grid Data: `https://api.weather.gov/gridpoints/{office}/{gridX},{gridY}`
- Observations: `https://api.weather.gov/stations/{stationId}/observations/latest`

**Important**: Must include `User-Agent` header in all requests

### 3. GFS Model Data (via Open-Meteo)
**Status**: ✅ Fully implemented
**Access**: Free, no API key required
**Use Case**: Medium-range forecasts (7+ days), model data

**Features**:
- GFS (Global Forecast System) model access
- ECMWF, NAM, and other models available
- Hourly and daily forecasts
- Ensemble (GEFS) for uncertainty quantification

**Why Open-Meteo Instead of Pivotal Weather**:
- Pivotal Weather doesn't provide a public API
- Open-Meteo offers free access to the same GFS model data
- Includes additional models (HRRR, ECMWF, NAM)

**API Documentation**: https://open-meteo.com/en/docs

### 4. HRRR Model
**Status**: ✅ Fully implemented (via Open-Meteo)
**Access**: Free, no API key required
**Use Case**: Short-term high-resolution forecasts (0-48 hours)

**Features**:
- 3km resolution (much higher than GFS)
- Updated hourly
- Best for near-term accuracy
- Limited to 48-hour forecasts

### 5. NWS River Forecast Centers (RFC)
**Status**: Stub implementation, needs scraping
**Access**: Free, requires web scraping
**Use Case**: Snow depth, SWE, and precipitation data

**RFC Regions**:
- **NERFC**: Northeast (Vermont, Maine, etc.)
- **CBRFC**: Colorado Basin (Colorado resorts)
- **CNRFC**: California/Nevada (Mammoth, etc.)
- **NWRFC**: Northwest (Washington, Oregon, Idaho)

**Features**:
- Snow depth measurements
- Snow Water Equivalent (SWE)
- 24hr/48hr/72hr snowfall totals
- Basin-wide snow pack data

**Implementation Notes**:
- Each RFC has different page structures
- Requires HTML parsing (use Cheerio)
- Data typically updated daily
- Example: https://www.weather.gov/nerfc/snowfall

### 6. SNOTEL (Bonus)
**Status**: Documented, not implemented
**Access**: Free via NRCS web services
**Use Case**: Automated high-elevation snow measurements

**Features**:
- 800+ stations across western US
- Snow depth, SWE, temperature, precipitation
- Historical data going back decades
- Updated hourly

**API**: https://wcc.sc.egov.usda.gov/awdbWebService/

## Data Aggregation Strategy

The `weatherAggregator.ts` service combines data from multiple sources with the following priority:

1. **Wunderground** (if configured) - Most local, real-time
2. **HRRR** - Best short-term accuracy (0-48 hours)
3. **GFS** - Medium-range forecasts (3-7 days)
4. **NOAA** - Official forecasts, fallback
5. **RFC** - Snow-specific data

### Elevation Adjustments

Weather data is adjusted for different elevations using:
- **Temperature**: -3.5°F per 1,000 ft elevation gain
- **Snow accumulation**: +10-20% at higher elevations
- **Wind speed**: Generally increases with elevation

## Usage Examples

### Fetch All Data for a Resort

```typescript
import { aggregateWeatherData } from '@/lib/services/weatherAggregator';
import { RESORTS } from '@/lib/resorts';

const stowe = RESORTS.find(r => r.id === 'stowe');
const weatherData = await aggregateWeatherData(stowe, {
  wunderground: {
    stationId: 'KVTSTOW123'
  }
});

console.log(weatherData.combined.current.temp);
console.log(weatherData.metadata.sourcesUsed); // ['NOAA', 'GFS Model', 'HRRR Model']
```

### Adjust for Specific Elevation

```typescript
import { adjustForElevation } from '@/lib/services/weatherAggregator';

const baseData = await aggregateWeatherData(stowe);
const summitData = adjustForElevation(
  baseData,
  stowe.elevations.base,
  stowe.elevations.summit
);
```

## Next Steps

### Immediate TODOs:

1. **Weather Underground Integration**:
   - Decide on API vs scraping approach
   - Implement station data fetching
   - Add configuration for each resort's nearby PWS

2. **RFC Snow Data Scraping**:
   - Build HTML parsers for each RFC region
   - Extract snow depth, SWE, and accumulation data
   - Cache data (updates once daily)

3. **API Route Updates**:
   - Replace mock data with real aggregated data
   - Add caching layer (Redis or in-memory)
   - Implement rate limiting

4. **Configuration**:
   - Add weather source config to each resort
   - Create admin UI for managing data sources
   - Add fallback strategies when sources fail

### Future Enhancements:

- **Webcams**: Integrate resort webcam feeds
- **Avalanche forecasts**: Link to local avalanche centers
- **Snow quality**: Use temp/humidity to predict snow quality
- **Alert system**: Notify users of powder days
- **Historical comparison**: Compare current season to averages

## API Rate Limits

- **NOAA**: No official limit, but be respectful (~1 req/sec)
- **Open-Meteo**: 10,000 requests/day (free tier)
- **Wunderground**: Depends on plan (enterprise)
- **RFC/SNOTEL**: No API, scraping should be limited

## Cost Analysis

| Source | Cost | API Key Required | Rate Limit |
|--------|------|------------------|------------|
| NOAA | FREE | No | ~1/sec |
| Open-Meteo | FREE | No | 10k/day |
| Weather Underground | $$ | Yes (enterprise) | Varies |
| RFC/SNOTEL | FREE | No | None (scraping) |

**Recommendation**: Start with free sources (NOAA + Open-Meteo), add WU only for resorts with on-mountain stations.
