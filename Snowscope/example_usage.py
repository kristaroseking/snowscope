"""
Example usage of the skiing condition rating model.

This demonstrates how to combine multiple data sources and calculate ratings.
"""

from datetime import datetime, timedelta
from data_parameters import (
    WeatherData,
    SnowData,
    ForecastData,
    SlopeConditions,
    SkiingConditionData,
    RatingWeights,
    RatingParameters
)
from rating_model import SkiingConditionRatingModel


def example_rating_calculation():
    """Example of calculating a skiing condition rating from multiple data sources"""
    
    # 1. Weather data (from weather API)
    # Note: Model auto-converts from C/km/h to F/mph if needed
    weather = WeatherData(
        temperature=23.0,  # Fahrenheit (or will convert from Celsius)
        feels_like=20.0,
        wind_speed=8.0,  # mph (or will convert from km/h)
        wind_gust=12.0,
        wind_direction=270,  # West wind
        humidity=65.0,  # %
        precipitation=0.0,
        precipitation_type=None,
        visibility=10.0,  # km
        cloud_cover=30.0,  # %
        pressure=1020.0,  # hPa
        uv_index=3.0,
        timestamp=datetime.now()
    )
    
    # 2. Snow data (from resort reports or sensors)
    # Note: Model auto-converts from cm to inches if needed
    # Using 32 inches to demonstrate dynamic weight adjustment (32-12=20, so +20% weight)
    snow = SnowData(
        base_depth=50.0,  # inches (or cm, will auto-convert) - 100 points
        new_snow_24h=32.0,  # inches - MASSIVE powder! (100 points, triggers dynamic weight adjustment)
        new_snow_48h=35.0,  # inches
        new_snow_7d=45.0,  # inches
        snow_quality='blower powder',  # 100 points
        surface_condition='ungroomed',
        last_snowfall=datetime.now() - timedelta(hours=6),  # Fresh snow today!
        timestamp=datetime.now()
    )
    
    # 3. Forecast data (from weather forecast API)
    now = datetime.now()
    forecast = ForecastData(
        forecast_temperature=[-4.0, -3.0, -2.0, -1.0],  # Next 4 hours
        forecast_precipitation=[0.0, 0.0, 2.0, 5.0],  # mm - snow expected later
        forecast_wind_speed=[18.0, 20.0, 22.0, 15.0],
        forecast_snow_probability=[0.0, 0.0, 60.0, 85.0],  # % chance
        forecast_timestamp=[
            now + timedelta(hours=i) for i in range(1, 5)
        ]
    )
    
    # 4. Slope-specific data (from resort systems)
    slope = SlopeConditions(
        slope_name='Black Diamond Run',
        elevation=2500.0,  # meters
        aspect='north',
        difficulty='black',
        open_status=True,
        lift_status=True,
        crowd_level='medium'
    )
    
    # 5. Combine all data sources
    condition_data = SkiingConditionData(
        weather=weather,
        snow=snow,
        forecast=forecast,
        slope=slope,
        historical_average_snow=95.0,  # cm - above average!
        season_total_snowfall=450.0,  # cm
        time_of_day='morning',
        day_of_week='saturday',
        timestamp=datetime.now()
    )
    
    # 6. Initialize rating model with custom weights
    custom_weights = RatingWeights(
        new_snow_weight=0.40,  # 40% - prioritize fresh snow
        snow_depth_weight=0.15,  # 15% - base depth
        snow_quality_weight=0.15,  # 15% - snow quality
        temperature_weight=0.15,  # 15% - temperature
        wind_weight=0.15,  # 15% - wind
        precipitation_weight=0.0,
        forecast_snow_weight=0.0,
        visibility_weight=0.0,
        crowd_factor_weight=0.0
    )
    model = SkiingConditionRatingModel(weights=custom_weights)
    
    # 7. Calculate rating
    result = model.calculate_rating(condition_data)
    
    # 8. Display results
    print("=" * 60)
    print("SKIING CONDITION RATING - POINT SYSTEM")
    print("=" * 60)
    print(f"\nOverall Rating: {result['rating'].name} ({result['rating'].value}/5)")
    print(f"Total Weighted Points: {result['total_weighted_points']:.1f}/100")
    
    print("\nCalculation Breakdown:")
    print("-" * 60)
    for factor in ['new_snow', 'base_depth', 'quality', 'temperature', 'wind']:
        raw_points = result['factor_points'][factor]
        weight_pct = result['details']['weights_used'][factor]
        weighted_contribution = result['weighted_factor_points'][factor]
        print(f"{factor.replace('_', ' ').title():15s}: {raw_points:5.1f} pts × {weight_pct:5.1%} = {weighted_contribution:5.1f} pts")
    
    print("\nWeights Applied:")
    print("-" * 60)
    base_weights = result['details'].get('base_weights', {})
    adjusted_weights = result['details']['weights_used']
    for factor in ['new_snow', 'base_depth', 'quality', 'temperature', 'wind']:
        base_w = base_weights.get(factor, 0)
        adj_w = adjusted_weights.get(factor, 0)
        if abs(base_w - adj_w) > 0.001:
            print(f"  {factor.replace('_', ' ').title():15s}: {base_w:.1%} → {adj_w:.1%} (adjusted)")
        else:
            print(f"  {factor.replace('_', ' ').title():15s}: {adj_w:.1%} (base)")
    
    # Show dynamic weight adjustment if applicable
    if result['details'].get('weight_adjustment_applied'):
        print(f"\n🎿 Dynamic Weight Adjustment (>12in snow bonus):")
        print(f"   New snow amount: {result['details']['new_snow_inches']:.1f} inches")
        print(f"   Weight increase: +{result['details']['weight_increase']:.1%}")
        print(f"   New snow weight: {adjusted_weights['new_snow']:.1%}")
    
    # Show degradation info if applicable
    deg_info = result['details'].get('new_snow_degradation_applied', {})
    if deg_info:
        print("\nNew Snow Degradation:")
        print(f"  Days since snow: {deg_info.get('days_since_snow', 0)}")
        print(f"  New snow (inches): {deg_info.get('new_snow_24h_inches', 0):.1f}")
        if deg_info.get('degradation_applied'):
            print(f"  Points lost: {deg_info.get('points_lost', 0)}")
        if deg_info.get('ice_condition_rain'):
            print(f"  ⚠️  ICE CONDITION: Rain detected")
        if deg_info.get('ice_condition_temp'):
            print(f"  ⚠️  ICE CONDITION: Temp too high ({deg_info.get('temperature_f', 0):.1f}°F)")
    print("=" * 60)
    
    return result


def example_custom_weights():
    """Example with custom weights prioritizing different factors"""
    
    # Customize weights - prioritize fresh snow for powder hunting
    custom_weights = RatingWeights(
        new_snow_weight=0.40,  # 40% - prioritize fresh snow
        snow_depth_weight=0.15,  # 15% - base depth
        snow_quality_weight=0.15,  # 15% - snow quality
        temperature_weight=0.15,  # 15% - temperature
        wind_weight=0.15,  # 15% - wind
        precipitation_weight=0.0,
        forecast_snow_weight=0.0,
        visibility_weight=0.0,
        crowd_factor_weight=0.0
    )
    
    # Customize thresholds (point-based thresholds)
    custom_params = RatingParameters(
        perfect_threshold=85.0,  # Points threshold for PERFECT rating
        excellent_threshold=75.0,
        good_threshold=60.0,
        fair_threshold=40.0
    )
    
    model = SkiingConditionRatingModel(
        weights=custom_weights,
        parameters=custom_params
    )
    
    # Example: Snow from 2 days ago with degradation
    weather = WeatherData(
        temperature=25.0,  # Fahrenheit
        feels_like=23.0,
        wind_speed=8.0,  # mph
        wind_gust=12.0,
        humidity=65.0,
        precipitation=0.0,
        precipitation_type=None,
        visibility=10.0,
        timestamp=datetime.now()
    )
    
    snow = SnowData(
        base_depth=45.0,  # inches
        new_snow_24h=0.0,  # No new snow today
        new_snow_48h=18.0,  # 18 inches fell 2 days ago (used for degradation calculation)
        snow_quality='blower powder',  # Still powder quality
        surface_condition='ungroomed',
        last_snowfall=datetime.now() - timedelta(days=2),  # Snow 2 days ago
        timestamp=datetime.now()
    )
    
    condition_data = SkiingConditionData(
        weather=weather,
        snow=snow,
        timestamp=datetime.now()
    )
    
    result = model.calculate_rating(condition_data)
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Degraded Snow (2 Days Old)")
    print("=" * 60)
    print(f"\nRating: {result['rating'].name} ({result['rating'].value}/5)")
    print(f"Total Weighted Points: {result['total_weighted_points']:.1f}/100")
    print("\nRaw Points:")
    for factor, points in result['factor_points'].items():
        print(f"  {factor.replace('_', ' ').title()}: {points:.1f} pts")
    
    deg_info = result['details'].get('new_snow_degradation_applied', {})
    if deg_info and deg_info.get('degradation_applied'):
        print(f"\n⚠️  New Snow Degradation:")
        print(f"   Original snowfall: {deg_info.get('original_snowfall_inches', 0):.1f} inches")
        print(f"   Initial base points: {deg_info.get('original_base_points', 0)}")
        print(f"   Days since snow: {deg_info.get('days_since_snow', 0)}")
        print(f"   Points lost: {deg_info.get('points_lost', 0)} (20 pts/day)")
        print(f"   Final points: {result['factor_points'].get('new_snow', 0):.1f}")
    
    return result


if __name__ == "__main__":
    # Run examples
    example_rating_calculation()
    print("\n" * 2)
    example_custom_weights()


