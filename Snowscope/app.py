"""
Simple Flask web application for testing the skiing condition rating model.
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from data_parameters import (
    WeatherData,
    SnowData,
    SkiingConditionData,
    RatingWeights,
    RatingParameters
)
from rating_model import SkiingConditionRatingModel
from stowe_scraper import get_stowe_conditions, get_stowe_forecast

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the rating model with default weights
model = SkiingConditionRatingModel(
    weights=RatingWeights(
        new_snow_weight=0.40,
        snow_depth_weight=0.15,
        snow_quality_weight=0.15,
        temperature_weight=0.15,
        wind_weight=0.15,
        precipitation_weight=0.0,
        forecast_snow_weight=0.0,
        visibility_weight=0.0,
        crowd_factor_weight=0.0
    )
)


def create_average_winter_conditions():
    """Create dummy data for average winter skiing conditions"""
    now = datetime.now()
    
    weather = WeatherData(
        temperature=25.0,  # Fahrenheit - typical skiing temp
        feels_like=22.0,
        wind_speed=8.0,  # mph - light breeze
        wind_gust=12.0,
        wind_direction=270,
        humidity=65.0,
        precipitation=0.0,
        precipitation_type=None,
        visibility=10.0,
        cloud_cover=40.0,
        pressure=1015.0,
        uv_index=2.0,
        timestamp=now
    )
    
    snow = SnowData(
        base_depth=35.0,  # inches - decent base
        new_snow_24h=6.0,  # inches - fresh snow
        new_snow_48h=12.0,
        new_snow_7d=24.0,
        snow_quality='regular density snow',  # 75 points
        surface_condition='groomed',
        last_snowfall=now - timedelta(hours=12),
        timestamp=now
    )
    
    return SkiingConditionData(
        weather=weather,
        snow=snow,
        timestamp=now
    )


def create_excellent_conditions():
    """Create dummy data for excellent powder day conditions"""
    now = datetime.now()
    
    weather = WeatherData(
        temperature=20.0,  # Fahrenheit - cold but not too cold
        feels_like=18.0,
        wind_speed=5.0,  # mph - calm
        wind_gust=7.0,
        humidity=60.0,
        precipitation=0.0,
        precipitation_type=None,
        visibility=15.0,
        timestamp=now
    )
    
    snow = SnowData(
        base_depth=50.0,  # inches - deep base
        new_snow_24h=18.0,  # inches - lots of fresh powder!
        new_snow_48h=22.0,
        new_snow_7d=40.0,
        snow_quality='blower powder',  # 100 points
        surface_condition='ungroomed',
        last_snowfall=now - timedelta(hours=3),
        timestamp=now
    )
    
    return SkiingConditionData(
        weather=weather,
        snow=snow,
        timestamp=now
    )


def create_blower_conditions():
    """Create dummy data for BLOWER conditions (90-100 points)"""
    now = datetime.now()
    
    weather = WeatherData(
        temperature=22.0,  # Fahrenheit - perfect temp (100 pts)
        feels_like=20.0,
        wind_speed=3.0,  # mph - very calm (100 pts)
        wind_gust=5.0,
        humidity=55.0,
        precipitation=0.0,
        precipitation_type=None,
        visibility=20.0,  # Perfect visibility
        timestamp=now
    )
    
    snow = SnowData(
        base_depth=55.0,  # inches - excellent base (100 pts)
        new_snow_24h=35.0,  # inches - MASSIVE fresh snow (100 pts, triggers max weight adjustment)
        new_snow_48h=38.0,
        new_snow_7d=50.0,
        snow_quality='blower powder',  # 100 points
        surface_condition='ungroomed',
        last_snowfall=now - timedelta(hours=2),  # Fresh!
        timestamp=now
    )
    
    return SkiingConditionData(
        weather=weather,
        snow=snow,
        timestamp=now
    )


def create_poor_conditions():
    """Create dummy data for poor skiing conditions"""
    now = datetime.now()
    
    weather = WeatherData(
        temperature=35.0,  # Fahrenheit - warm
        feels_like=33.0,
        wind_speed=25.0,  # mph - very windy
        wind_gust=30.0,
        humidity=80.0,
        precipitation=2.0,
        precipitation_type='rain',  # Rain!
        visibility=3.0,  # Poor visibility
        timestamp=now
    )
    
    snow = SnowData(
        base_depth=8.0,  # inches - thin base
        new_snow_24h=0.0,  # No new snow
        new_snow_48h=0.0,
        snow_quality='icy',  # Icy conditions
        surface_condition='variable',
        last_snowfall=now - timedelta(days=5),  # Old snow
        timestamp=now
    )
    
    return SkiingConditionData(
        weather=weather,
        snow=snow,
        timestamp=now
    )


@app.route('/')
def index():
    """Render the main Stowe conditions page"""
    return render_template('stowe_app.html')


@app.route('/api/calculate', methods=['POST'])
def calculate_rating():
    """API endpoint to calculate rating from JSON data"""
    try:
        data = request.json
        
        # Parse weather data
        weather = WeatherData(
            temperature=float(data.get('temperature', 25.0)),
            feels_like=float(data.get('feels_like', 22.0)),
            wind_speed=float(data.get('wind_speed', 8.0)),
            wind_gust=float(data.get('wind_gust', 12.0)) if data.get('wind_gust') else None,
            wind_direction=int(data.get('wind_direction', 270)) if data.get('wind_direction') else None,
            humidity=float(data.get('humidity', 65.0)),
            precipitation=float(data.get('precipitation', 0.0)),
            precipitation_type=data.get('precipitation_type'),
            visibility=float(data.get('visibility', 10.0)) if data.get('visibility') else None,
            timestamp=datetime.now()
        )
        
        # Parse snow data
        snow = SnowData(
            base_depth=float(data.get('base_depth', 35.0)),
            new_snow_24h=float(data.get('new_snow_24h', 6.0)),
            new_snow_48h=float(data.get('new_snow_48h')) if data.get('new_snow_48h') else None,
            new_snow_7d=float(data.get('new_snow_7d')) if data.get('new_snow_7d') else None,
            snow_quality=data.get('snow_quality', 'regular density snow'),
            surface_condition=data.get('surface_condition'),
            last_snowfall=datetime.now() - timedelta(hours=int(data.get('hours_since_snowfall', 12))),
            timestamp=datetime.now()
        )
        
        condition_data = SkiingConditionData(
            weather=weather,
            snow=snow,
            timestamp=datetime.now()
        )
        
        # Calculate rating
        result = model.calculate_rating(condition_data)
        
        # Get rating color
        rating_colors = {
            'BAD': '#dc3545',        # red
            'POOR': '#ff8c00',       # dark orange
            'FAIR': '#90ee90',       # light green
            'GOOD': '#28a745',       # green
            'EXCELLENT': '#006400',  # dark green
            'PERFECT': '#9370db',    # purple
            'BLOWER': '#ff69b4',     # pink
            'GO_SURFING': '#6b7280'  # grey
        }
        
        # Convert result to JSON-serializable format
        # Handle both string ratings (GO_SURFING) and enum ratings
        rating_name = result['rating'] if isinstance(result['rating'], str) else result['rating'].name
        rating_value = 0 if result['rating'] == 'GO_SURFING' else (result['rating'].value if hasattr(result['rating'], 'value') else 0)

        return jsonify({
            'rating': rating_name,
            'rating_value': rating_value,
            'rating_color': rating_colors.get(rating_name, '#666'),
            'total_weighted_points': round(result['total_weighted_points'], 1),
            'factor_points': {k: round(v, 1) for k, v in result['factor_points'].items()},
            'weighted_factor_points': {k: round(v, 1) for k, v in result['weighted_factor_points'].items()},
            'details': result['details']
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/forecast/<days>')
def get_forecast(days):
    """Generate forecast data for multiple days"""
    try:
        num_days = int(days)
        if num_days > 10:
            num_days = 10
        
        forecast_data = []
        base_time = datetime.now()
        
        # Generate blower conditions for all days (for demo)
        for day in range(num_days):
            day_time = base_time + timedelta(days=day)
            
            # Slightly vary conditions each day
            weather = WeatherData(
                temperature=22.0 + (day * 0.5),
                wind_speed=3.0 + (day * 0.2),
                humidity=55.0,
                precipitation=0.0,
                precipitation_type=None,
                visibility=20.0,
                timestamp=day_time
            )
            
            snow = SnowData(
                base_depth=55.0 - (day * 0.5),  # Slight degradation
                new_snow_24h=max(0, 35.0 - (day * 3.0)),  # Degrade over days
                new_snow_48h=max(0, 38.0 - (day * 3.5)),
                snow_quality='blower powder' if day < 2 else 'regular density snow',
                last_snowfall=base_time - timedelta(days=day, hours=2),
                timestamp=day_time
            )
            
            condition_data = SkiingConditionData(
                weather=weather,
                snow=snow,
                timestamp=day_time
            )
            
            day_result = model.calculate_rating(condition_data)
            
            rating_colors = {
                'BAD': '#dc3545',
                'POOR': '#ff8c00',
                'FAIR': '#90ee90',
                'GOOD': '#28a745',
                'EXCELLENT': '#006400',
                'PERFECT': '#9370db',
                'BLOWER': '#ff69b4',
                'GO_SURFING': '#6b7280'
            }

            forecast_data.append({
                'day': day + 1,
                'date': day_time.strftime('%Y-%m-%d'),
                'day_name': day_time.strftime('%A'),
                'rating': day_result['rating'].name,
                'rating_color': rating_colors.get(day_result['rating'].name, '#666'),
                'points': round(day_result['total_weighted_points'], 1),
                'temperature': weather.temperature,
                'wind_speed': weather.wind_speed,
                'new_snow': snow.new_snow_24h,
                'base_depth': snow.base_depth,
                'snow_quality': snow.snow_quality
            })
        
        return jsonify(forecast_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/stowe/current')
def get_stowe_current():
    """Get current Stowe conditions and calculate rating"""
    try:
        # Get conditions from Stowe
        stowe_data = get_stowe_conditions()
        
        # Create weather data
        weather = WeatherData(
            temperature=stowe_data['temperature'],
            wind_speed=stowe_data['wind_speed'],
            wind_gust=stowe_data.get('wind_gust'),
            humidity=stowe_data['humidity'],
            precipitation=stowe_data['precipitation'],
            precipitation_type=stowe_data.get('precipitation_type'),
            timestamp=datetime.now()
        )
        
        # Create snow data
        snow = SnowData(
            base_depth=stowe_data['base_depth'],
            new_snow_24h=stowe_data['new_snow_24h'],
            new_snow_48h=stowe_data.get('new_snow_48h'),
            new_snow_7d=stowe_data.get('new_snow_7d'),
            snow_quality=stowe_data['snow_quality'],
            last_snowfall=datetime.now() - timedelta(hours=12),
            timestamp=datetime.now()
        )
        
        condition_data = SkiingConditionData(
            weather=weather,
            snow=snow,
            timestamp=datetime.now()
        )
        
        # Calculate overall rating
        result = model.calculate_rating(condition_data)
        
        # Calculate time-specific ratings (morning, midday, night)
        # Adjust temperature slightly for different times of day
        time_ratings = {}
        for time_name, temp_adjustment in [('morning', -3), ('midday', 5), ('night', -5)]:
            time_weather = WeatherData(
                temperature=weather.temperature + temp_adjustment,
                wind_speed=weather.wind_speed,
                wind_gust=weather.wind_gust,
                humidity=weather.humidity,
                precipitation=weather.precipitation,
                precipitation_type=weather.precipitation_type,
                timestamp=datetime.now()
            )
            
            time_condition_data = SkiingConditionData(
                weather=time_weather,
                snow=snow,
                timestamp=datetime.now()
            )
            
            time_result = model.calculate_rating(time_condition_data)
            
            rating_colors = {
                'BAD': '#dc3545',
                'POOR': '#ff8c00',
                'FAIR': '#90ee90',
                'GOOD': '#28a745',
                'EXCELLENT': '#006400',
                'PERFECT': '#9370db',
                'BLOWER': '#ff69b4',
                'GO_SURFING': '#6b7280'
            }

            time_ratings[time_name] = {
                'rating': time_result['rating'].name,
                'rating_color': rating_colors.get(time_result['rating'].name, '#666'),
                'points': round(time_result['total_weighted_points'], 1),
                'temperature': round(time_weather.temperature, 1)
            }
        
        rating_colors = {
            'BAD': '#dc3545',
            'POOR': '#ff8c00',
            'FAIR': '#90ee90',
            'GOOD': '#28a745',
            'EXCELLENT': '#006400',
            'PERFECT': '#9370db',
            'BLOWER': '#ff69b4',
            'GO_SURFING': '#6b7280'
        }

        return jsonify({
            'rating': result['rating'].name,
            'rating_value': result['rating'].value,
            'rating_color': rating_colors.get(result['rating'].name, '#666'),
            'total_weighted_points': round(result['total_weighted_points'], 1),
            'time_ratings': time_ratings,
            'conditions': {
                'temperature': weather.temperature,
                'wind_speed': weather.wind_speed,
                'base_depth': snow.base_depth,
                'new_snow_24h': snow.new_snow_24h,
                'snow_quality': snow.snow_quality,
                'humidity': weather.humidity
            }
        })
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/stowe/forecast')
def get_stowe_forecast_api():
    """Get 10-day forecast for Stowe"""
    try:
        forecast = get_stowe_forecast()
        forecast_results = []
        
        for day_data in forecast:
            weather = WeatherData(
                temperature=day_data['temperature'],
                wind_speed=day_data['wind_speed'],
                humidity=65.0,
                precipitation=0.0,
                precipitation_type=day_data.get('precipitation_type'),
                timestamp=datetime.now()
            )
            
            snow = SnowData(
                base_depth=day_data['base_depth'],
                new_snow_24h=day_data['new_snow_24h'],
                snow_quality=day_data['snow_quality'],
                last_snowfall=datetime.now() - timedelta(days=len(forecast_results)),
                timestamp=datetime.now()
            )
            
            condition_data = SkiingConditionData(
                weather=weather,
                snow=snow,
                timestamp=datetime.now()
            )
            
            day_result = model.calculate_rating(condition_data)
            
            rating_colors = {
                'BAD': '#dc3545',
                'POOR': '#ff8c00',
                'FAIR': '#90ee90',
                'GOOD': '#28a745',
                'EXCELLENT': '#006400',
                'PERFECT': '#9370db',
                'BLOWER': '#ff69b4',
                'GO_SURFING': '#6b7280'
            }

            forecast_results.append({
                'day': len(forecast_results) + 1,
                'date': day_data['date'],
                'day_name': day_data['day_name'],
                'rating': day_result['rating'].name,
                'rating_color': rating_colors.get(day_result['rating'].name, '#666'),
                'points': round(day_result['total_weighted_points'], 1),
                'temperature': day_data['temperature'],
                'wind_speed': day_data['wind_speed'],
                'new_snow': day_data['new_snow_24h'],
                'base_depth': day_data['base_depth'],
                'snow_quality': day_data['snow_quality']
            })
        
        return jsonify(forecast_results)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/dummy-data/<scenario>')
def get_dummy_data(scenario):
    """Get dummy data for different scenarios"""
    scenarios = {
        'average': create_average_winter_conditions,
        'excellent': create_excellent_conditions,
        'poor': create_poor_conditions,
        'blower': create_blower_conditions
    }
    
    if scenario not in scenarios:
        return jsonify({'error': 'Invalid scenario'}), 400
    
    data = scenarios[scenario]()
    
    # Convert to JSON-serializable format
    return jsonify({
        'temperature': data.weather.temperature,
        'feels_like': data.weather.feels_like,
        'wind_speed': data.weather.wind_speed,
        'wind_gust': data.weather.wind_gust,
        'humidity': data.weather.humidity,
        'precipitation': data.weather.precipitation,
        'precipitation_type': data.weather.precipitation_type,
        'visibility': data.weather.visibility,
        'base_depth': data.snow.base_depth,
        'new_snow_24h': data.snow.new_snow_24h,
        'new_snow_48h': data.snow.new_snow_48h,
        'new_snow_7d': data.snow.new_snow_7d,
        'snow_quality': data.snow.snow_quality,
        'surface_condition': data.snow.surface_condition,
        'hours_since_snowfall': (datetime.now() - data.snow.last_snowfall).total_seconds() / 3600
    })


if __name__ == '__main__':
    import sys
    
    print("=" * 70)
    print(" " * 15 + "Snowscope Skiing Condition Rating Server")
    print("=" * 70)
    print()
    print("Checking system...")
    
    try:
        from flask import Flask
        print("  [OK] Flask imported")
    except ImportError as e:
        print(f"  [ERROR] Flask not installed: {e}")
        print("  Run: pip install Flask")
        sys.exit(1)
    
    try:
        from stowe_scraper import get_stowe_conditions
        print("  [OK] Stowe scraper imported")
    except Exception as e:
        print(f"  [WARN] Scraper import issue: {e}")
    
    print()
    print("Starting Flask server...")
    print()
    print("=" * 70)
    print("  Server URLs:")
    print("    - http://localhost:5000")
    print("    - http://127.0.0.1:5000")
    print()
    print("  Press CTRL+C to stop the server")
    print("=" * 70)
    print()
    print("Waiting for connections...")
    print()
    
    try:
        app.run(debug=True, port=8080, host='127.0.0.1', use_reloader=False)
    except OSError as e:
        if "Address already in use" in str(e) or "address is already in use" in str(e).lower():
            print()
            print("!" * 70)
            print("  ERROR: Port 5000 is already in use!")
            print()
            print("  Solutions:")
            print("    1. Close any other Python/Flask applications")
            print("    2. Or change port in app.py (line with port=5000)")
            print("!" * 70)
            print()
        else:
            print()
            print(f"ERROR starting server: {e}")
            print()
            import traceback
            traceback.print_exc()
        sys.exit(1)
    except KeyboardInterrupt:
        print()
        print("Server stopped by user.")
        sys.exit(0)

