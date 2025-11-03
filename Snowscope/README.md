# Snowscope - Skiing Condition Rating Model

A data model and rating system for calculating skiing condition ratings by combining multiple data sources (weather, snow conditions, forecasts, and slope information).

## Overview

This system takes data from multiple sources (weather APIs, snow reports, forecasts, resort systems) and combines them to produce a comprehensive skiing condition rating using a point-based system.

## Components

### 1. Data Parameters (`data_parameters.py`)

Defines the data structures for all input parameters:

- **WeatherData**: Current weather conditions (temperature, wind, precipitation, etc.)
- **SnowData**: Snow conditions (depth, new snow, quality, surface conditions)
- **ForecastData**: Weather forecasts for future conditions
- **SlopeConditions**: Slope-specific information
- **SkiingConditionData**: Combined data structure from all sources
- **RatingWeights**: Configuration for factor weights in calculations
- **RatingParameters**: Thresholds and optimization parameters

### 2. Rating Model (`rating_model.py`)

The `SkiingConditionRatingModel` class that:

- Takes combined data from all sources
- Calculates individual factor points (0-100 each)
- Applies weighted combinations
- Includes dynamic weight adjustment for heavy snowfall (>12in)
- Applies degradation logic for old snow
- Converts total weighted points to condition ratings (POOR, FAIR, GOOD, EXCELLENT, PERFECT)

### 3. Web Application (`app.py`)

A Flask web server that provides:
- RESTful API for calculating ratings
- Pre-configured dummy data scenarios
- Web interface for testing

## Point-Based Rating System

The model calculates points (0-100) for each parameter, then applies weights:

1. **New Snow** (40% base weight): 0-100 points based on snowfall amount with degradation
2. **Base Depth** (15% base weight): 0-100 points based on base depth
3. **Snow Quality** (15% base weight): 0-100 points (powder=100, regular=75, wet=25, ice=0)
4. **Temperature** (15% base weight): 0-100 points based on optimal ranges
5. **Wind** (15% base weight): 0-100 points (calm=100, windy=0)

### Dynamic Weight Adjustment

When new snow > 12 inches:
- New snow weight increases by 1% per inch above 12in (max 60%)
- Other weights decrease by 0.25% each per 1% increase in new snow
- Example: 32in snow → 60% new snow, 10% each for others

### Final Rating Calculation

Total weighted points = sum of (factor_points × weight_percentage)
- **PERFECT** (5): ≥ 85 points
- **EXCELLENT** (4): ≥ 75 points
- **GOOD** (3): ≥ 60 points
- **FAIR** (2): ≥ 40 points
- **POOR** (1): < 40 points

## Usage

### Web Interface

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask app:
```bash
python app.py
```

3. Open your browser to:
```
http://localhost:5000
```

4. Select a scenario or input custom data, then click "Calculate Rating"

### Python API

```python
from data_parameters import WeatherData, SnowData, SkiingConditionData
from rating_model import SkiingConditionRatingModel

# Create data
weather = WeatherData(temperature=25.0, wind_speed=8.0, ...)
snow = SnowData(base_depth=35.0, new_snow_24h=6.0, ...)
condition_data = SkiingConditionData(weather=weather, snow=snow)

# Calculate rating
model = SkiingConditionRatingModel()
result = model.calculate_rating(condition_data)

print(f"Rating: {result['rating'].name}")
print(f"Points: {result['total_weighted_points']}/100")
```

### REST API

Calculate rating via POST request:
```bash
curl -X POST http://localhost:5000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.0,
    "wind_speed": 8.0,
    "base_depth": 35.0,
    "new_snow_24h": 6.0,
    "snow_quality": "regular density snow"
  }'
```

Load dummy data:
```bash
curl http://localhost:5000/api/dummy-data/average
curl http://localhost:5000/api/dummy-data/excellent
curl http://localhost:5000/api/dummy-data/poor
```

## Customization

You can customize the model by adjusting weights and parameters:

```python
from data_parameters import RatingWeights, RatingParameters

custom_weights = RatingWeights(
    new_snow_weight=0.40,
    snow_depth_weight=0.15,
    snow_quality_weight=0.15,
    temperature_weight=0.15,
    wind_weight=0.15
)

custom_params = RatingParameters(
    perfect_threshold=85.0,
    excellent_threshold=75.0,
    good_threshold=60.0,
    fair_threshold=40.0
)

model = SkiingConditionRatingModel(
    weights=custom_weights,
    parameters=custom_params
)
```

## Next Steps

To integrate with real data sources:

1. Add API clients for weather services (OpenWeatherMap, WeatherAPI, etc.)
2. Add data fetchers for snow reports (resort APIs, Snow-Forecast, etc.)
3. Add data fetchers for forecasts
4. Add data transformation layers to convert API responses to the data parameter structures
5. Add caching/storage for historical data
6. Build the full application interface

## Testing

Run the example to see the model in action:

```bash
python example_usage.py
```

Or use the web interface:

```bash
python app.py
# Then open http://localhost:5000 in your browser
```
