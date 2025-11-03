# Python Scoring API Integration Guide

This guide explains how to integrate the Python-based ski condition scoring model with your Next.js Snowline app.

## Architecture

The integration uses a **Flask backend + Next.js API proxy** pattern:

```
Next.js Frontend → Next.js API Route → Flask Python API → Scoring Model
(Port 3001)         (/api/score)         (Port 5000)        (rating_model.py)
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd Snowscope
pip3 install -r requirements.txt
```

This installs:
- Flask (web framework)
- flask-cors (enable cross-origin requests)
- requests, beautifulsoup4, lxml (for web scraping)

### 2. Start the Flask API Server

**Option A: Using the startup script (Mac/Linux)**
```bash
cd Snowscope
./start_flask.sh
```

**Option B: Manual start**
```bash
cd Snowscope
python3 app.py
```

The Flask server will start on `http://localhost:8080`

### 3. Start the Next.js App

In a separate terminal:
```bash
npm run dev
```

The Next.js app runs on `http://localhost:3001`

### 4. Configure Environment (Optional)

Create a `.env.local` file in the project root to customize the Python API URL:

```bash
PYTHON_API_URL=http://localhost:8080
```

## API Usage

### Endpoint

```
POST http://localhost:3001/api/score
```

### Request Format

```json
{
  "temperature": 25.0,
  "feels_like": 22.0,
  "wind_speed": 8.0,
  "wind_gust": 12.0,
  "wind_direction": 270,
  "humidity": 65.0,
  "precipitation": 0.0,
  "precipitation_type": null,
  "visibility": 10.0,
  "base_depth": 35.0,
  "new_snow_24h": 6.0,
  "new_snow_48h": 12.0,
  "new_snow_7d": 24.0,
  "snow_quality": "regular density snow",
  "surface_condition": "groomed"
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "overall_score": 75.5,
    "rating": "GOOD",
    "rating_emoji": "😊",
    "component_scores": {
      "new_snow": {
        "score": 60.0,
        "weight": 0.40,
        "max_possible": 40.0,
        "percentage": 60.0
      },
      "snow_depth": {
        "score": 70.0,
        "weight": 0.15,
        "max_possible": 15.0,
        "percentage": 70.0
      },
      "snow_quality": {
        "score": 75.0,
        "weight": 0.15,
        "max_possible": 15.0,
        "percentage": 75.0
      },
      "temperature": {
        "score": 100.0,
        "weight": 0.15,
        "max_possible": 15.0,
        "percentage": 100.0
      },
      "wind": {
        "score": 80.0,
        "weight": 0.15,
        "max_possible": 15.0,
        "percentage": 80.0
      }
    },
    "details": {
      "conditions_summary": "Good skiing conditions with fresh snow",
      "best_for": ["Intermediate terrain", "Groomed runs"],
      "considerations": ["Watch for variable conditions"]
    }
  }
}
```

## Using in Your App

### Example: Fetch Score for a Resort

```typescript
// In your Next.js component or API route
import type { SkiConditionRatingRequest } from "@/types/scoring";

async function getResortScore(resortWeather: any) {
  const scoringData: SkiConditionRatingRequest = {
    temperature: resortWeather.current.base.temp,
    feels_like: resortWeather.current.base.feelsLike,
    wind_speed: resortWeather.current.base.windSpeed,
    humidity: resortWeather.current.base.humidity,
    precipitation: 0,
    base_depth: 35, // You'll need to track this
    new_snow_24h: resortWeather.current.base.snowfall24h,
    snow_quality: "regular density snow",
  };

  const response = await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scoringData),
  });

  const result = await response.json();
  return result.data;
}
```

## Rating Scale

The scoring model returns ratings on a scale:

- **BLOWER** (90-100): Epic powder conditions
- **EPIC** (80-89): Excellent conditions
- **GREAT** (70-79): Great skiing
- **GOOD** (60-69): Good conditions
- **FAIR** (50-59): Fair conditions
- **POOR** (0-49): Poor conditions

## Files Created

1. **`Snowscope/app.py`** - Updated with CORS support
2. **`types/scoring.ts`** - TypeScript types for API
3. **`app/api/score/route.ts`** - Next.js API proxy
4. **`Snowscope/start_flask.sh`** - Flask startup script

## Troubleshooting

### Port Already in Use

If port 5000 is taken, edit `Snowscope/app.py` and change:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change to different port
```

Then update `.env.local`:
```
PYTHON_API_URL=http://localhost:5001
```

### CORS Errors

Make sure flask-cors is installed:
```bash
pip3 install flask-cors
```

### Connection Refused

Ensure the Flask server is running before making requests from Next.js.

## Next Steps

1. **Add to Resort Pages**: Display the condition score on individual resort pages
2. **Add Scoring Badge**: Create a visual component showing the rating
3. **Historical Tracking**: Store scores over time to show trends
4. **Forecasting**: Use forecast data to predict future scores

## Production Deployment

For production, consider:
1. Deploying Flask API to a service like Railway, Render, or AWS Lambda
2. Update `PYTHON_API_URL` environment variable to point to production API
3. Add API authentication/rate limiting
4. Cache scores to reduce API calls
