"""
Data Parameters for Skiing Condition Rating Model

This module defines the data parameters from multiple sources that will be used
to calculate skiing condition ratings.
"""

from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ConditionRating(Enum):
    """Skiing condition rating scale (0-100 points)"""
    BAD = 1        # 0-10 points
    POOR = 2       # 10-20 points
    FAIR = 3       # 20-40 points
    GOOD = 4       # 40-60 points
    EXCELLENT = 5  # 60-80 points
    PERFECT = 6    # 80-90 points
    BLOWER = 7     # 90-100 points


@dataclass
class WeatherData:
    """Weather data parameters from weather API sources"""
    temperature: float  # Fahrenheit (will be converted from Celsius if needed)
    wind_speed: float  # mph (will be converted from km/h if needed)
    humidity: float  # percentage (0-100)
    precipitation: float  # inches or mm
    feels_like: Optional[float] = None  # Apparent temperature
    wind_gust: Optional[float] = None  # mph
    wind_direction: Optional[int] = None  # degrees (0-360)
    precipitation_type: Optional[str] = None  # "rain", "snow", "sleet", etc.
    visibility: Optional[float] = None  # km
    cloud_cover: Optional[float] = None  # percentage (0-100)
    pressure: Optional[float] = None  # hPa
    uv_index: Optional[float] = None
    timestamp: Optional[datetime] = None


@dataclass
class SnowData:
    """Snow condition parameters from snow reports or sensors"""
    base_depth: float  # cm - current base snow depth (will be converted from inches if needed)
    new_snow_24h: float  # inches or cm - snowfall in last 24 hours (will be converted to inches for scoring)
    new_snow_48h: Optional[float] = None  # inches or cm - snowfall in last 48 hours
    new_snow_7d: Optional[float] = None  # inches or cm - snowfall in last 7 days
    snow_quality: Optional[str] = None  # "powder", "packed", "icy", "slushy", etc.
    surface_condition: Optional[str] = None  # "groomed", "ungroomed", "variable", etc.
    last_snowfall: Optional[datetime] = None  # When last snow fell
    days_since_last_snowfall: Optional[int] = None  # Days since last snowfall (auto-calculated if not provided)
    timestamp: Optional[datetime] = None


@dataclass
class ForecastData:
    """Weather forecast parameters for future conditions"""
    forecast_temperature: List[float]  # Temperatures for next 24-48 hours
    forecast_precipitation: List[float]  # Expected precipitation
    forecast_wind_speed: List[float]  # Expected wind speeds
    forecast_snow_probability: Optional[List[float]] = None  # Probability of snow (0-100)
    forecast_timestamp: Optional[List[datetime]] = None


@dataclass
class SlopeConditions:
    """Slope-specific condition parameters"""
    slope_name: str
    elevation: Optional[float] = None  # meters above sea level
    aspect: Optional[str] = None  # "north", "south", "east", "west", etc.
    difficulty: Optional[str] = None  # "green", "blue", "black", etc.
    open_status: Optional[bool] = None  # Whether slope is open
    lift_status: Optional[bool] = None  # Whether lift is operational
    crowd_level: Optional[str] = None  # "low", "medium", "high", "very_high"


@dataclass
class SkiingConditionData:
    """
    Combined data parameters from all sources for rating calculation.
    This is the main data structure that the rating model will use.
    """
    # Current conditions
    weather: WeatherData
    snow: SnowData
    
    # Forecast data
    forecast: Optional[ForecastData] = None
    
    # Slope-specific data
    slope: Optional[SlopeConditions] = None
    
    # Historical/comparison data (optional)
    historical_average_snow: Optional[float] = None  # Average snow depth for this date
    season_total_snowfall: Optional[float] = None  # Total snowfall this season
    
    # Additional factors
    time_of_day: Optional[str] = None  # "morning", "afternoon", "evening"
    day_of_week: Optional[str] = None  # For crowd prediction
    timestamp: Optional[datetime] = None


@dataclass
class RatingWeights:
    """
    Weight configuration for different factors in the rating calculation.
    Adjust these weights to tune how much each factor influences the final rating.
    """
    # Snow factors (most important for skiing)
    snow_depth_weight: float = 0.25
    new_snow_weight: float = 0.25
    snow_quality_weight: float = 0.15
    
    # Weather factors
    temperature_weight: float = 0.10
    wind_weight: float = 0.10
    precipitation_weight: float = 0.05
    
    # Forecast factors
    forecast_snow_weight: float = 0.05
    
    # Operational factors
    visibility_weight: float = 0.03
    crowd_factor_weight: float = 0.02
    
    def validate(self):
        """Ensure weights sum to approximately 1.0"""
        total = (
            self.snow_depth_weight + self.new_snow_weight + self.snow_quality_weight +
            self.temperature_weight + self.wind_weight + self.precipitation_weight +
            self.forecast_snow_weight + self.visibility_weight + self.crowd_factor_weight
        )
        if abs(total - 1.0) > 0.01:
            raise ValueError(f"Weights must sum to 1.0, got {total}")


@dataclass
class RatingParameters:
    """
    Threshold parameters for converting total weighted points to condition ratings.
    These define the point ranges for each rating level.
    """
    # Total weighted point thresholds (0-100 scale after weighting)
    blower_threshold: float = 90.0    # 90-100 = BLOWER
    perfect_threshold: float = 80.0    # 80-90 = PERFECT
    excellent_threshold: float = 60.0  # 60-80 = EXCELLENT
    good_threshold: float = 40.0      # 40-60 = GOOD
    fair_threshold: float = 20.0      # 20-40 = FAIR
    poor_threshold: float = 10.0     # 10-20 = POOR
    # 0-10 = BAD
    
    # New snow degradation settings
    new_snow_degradation_per_day: int = 20  # Points lost per day after snowfall
    rain_temperature_threshold: float = 30.0  # Fahrenheit - above this temp causes ice


