"""
Skiing Condition Rating Model - Point-Based System

This module contains the model for calculating skiing condition ratings
using a point-based system (0-100 points per parameter) with weighted combination.
"""

from data_parameters import (
    SkiingConditionData,
    RatingWeights,
    RatingParameters,
    ConditionRating
)
from typing import Dict
from datetime import datetime, timedelta


class SkiingConditionRatingModel:
    """
    Model for calculating skiing condition ratings from multiple data sources
    using a point-based scoring system.
    """
    
    def __init__(
        self,
        weights: RatingWeights = None,
        parameters: RatingParameters = None
    ):
        """
        Initialize the rating model with weights and parameters.
        
        Args:
            weights: Configuration for factor weights in calculation
            parameters: Threshold parameters for rating conversion
        """
        self.weights = weights or RatingWeights()
        self.parameters = parameters or RatingParameters()
        self.weights.validate()
    
    def calculate_rating(self, data: SkiingConditionData) -> Dict:
        """
        Calculate skiing condition rating from combined data sources.

        Args:
            data: Combined data from all sources (weather, snow, forecast, etc.)

        Returns:
            Dictionary containing:
            - rating: ConditionRating enum value
            - total_weighted_points: Total weighted points (0-100)
            - factor_points: Individual point scores (0-100 each)
            - weighted_factor_points: Weighted point contributions
            - details: Detailed breakdown of calculations
        """
        # Check if resort is closed (base depth < 5 inches)
        base_depth_inches = self._cm_to_inches_if_needed(data.snow.base_depth)
        if base_depth_inches < 5:
            return {
                'rating': 'GO_SURFING',
                'total_weighted_points': 0,
                'factor_points': {},
                'weighted_factor_points': {},
                'details': {
                    'closed': True,
                    'base_depth_inches': base_depth_inches,
                    'message': 'Resort conditions not suitable - base depth less than 5 inches'
                }
            }

        factor_points = {}
        weighted_factor_points = {}

        # Calculate days since last snowfall if not provided
        days_since_snow = self._calculate_days_since_snowfall(data)
        if data.snow.days_since_last_snowfall is None:
            data.snow.days_since_last_snowfall = days_since_snow
        
        # 1. New Snow Points (with degradation logic)
        factor_points['new_snow'] = self._calculate_new_snow_points(
            data.snow.new_snow_24h,
            data.snow.new_snow_48h,
            days_since_snow,
            data.weather.precipitation_type,
            data.weather.temperature
        )
        
        # 2. Base Depth Points
        factor_points['base_depth'] = self._calculate_base_depth_points(data.snow.base_depth)
        
        # 3. Snow Quality Points
        factor_points['quality'] = self._calculate_quality_points(data.snow.snow_quality)
        
        # 4. Temperature Points
        factor_points['temperature'] = self._calculate_temperature_points(data.weather.temperature)
        
        # 5. Wind Points
        factor_points['wind'] = self._calculate_wind_points(
            data.weather.wind_speed,
            data.weather.wind_gust
        )
        
        # Calculate dynamic weights based on new snow amount (>12in bonus)
        # Convert new_snow_24h to inches if needed
        new_snow_inches = self._cm_to_inches_if_needed(data.snow.new_snow_24h)
        
        # Get adjusted weights (increases new_snow weight if >12in, reduces others proportionally)
        adjusted_weights = self._calculate_dynamic_weights(new_snow_inches)
        
        # Calculate weighted point contributions
        # Formula: (points / 100) * weight_percentage = weighted_contribution
        # Example: 100pts at 40% = 40 points contribution
        weighted_factor_points['new_snow'] = (factor_points['new_snow'] / 100.0) * (adjusted_weights['new_snow'] * 100)
        weighted_factor_points['base_depth'] = (factor_points['base_depth'] / 100.0) * (adjusted_weights['base_depth'] * 100)
        weighted_factor_points['quality'] = (factor_points['quality'] / 100.0) * (adjusted_weights['quality'] * 100)
        weighted_factor_points['temperature'] = (factor_points['temperature'] / 100.0) * (adjusted_weights['temperature'] * 100)
        weighted_factor_points['wind'] = (factor_points['wind'] / 100.0) * (adjusted_weights['wind'] * 100)
        
        # Calculate total weighted points (0-100 scale)
        total_weighted_points = sum(weighted_factor_points.values())
        
        # Ensure total is in [0, 100] range
        total_weighted_points = max(0.0, min(100.0, total_weighted_points))
        
        # Convert total points to rating
        rating = self._points_to_rating(total_weighted_points)
        
        return {
            'rating': rating,
            'total_weighted_points': total_weighted_points,
            'factor_points': factor_points,
            'weighted_factor_points': weighted_factor_points,
            'details': {
                'weights_used': adjusted_weights,  # Show adjusted weights
                'base_weights': self._weights_to_dict(),  # Show original weights
                'weight_adjustment_applied': new_snow_inches > 12.0,
                'new_snow_inches': new_snow_inches,
                'weight_increase': (adjusted_weights['new_snow'] - self.weights.new_snow_weight) if new_snow_inches > 12.0 else 0.0,
                'days_since_snowfall': days_since_snow,
                'new_snow_degradation_applied': self._get_degradation_info(
                    data.snow.new_snow_24h,
                    data.snow.new_snow_48h,
                    days_since_snow,
                    data.weather.precipitation_type,
                    data.weather.temperature
                )
            }
        }
    
    def _calculate_days_since_snowfall(self, data: SkiingConditionData) -> int:
        """Calculate days since last snowfall"""
        if data.snow.last_snowfall is None:
            # If no timestamp, estimate from new_snow_24h
            if data.snow.new_snow_24h > 0:
                return 0  # Snow fell today
            return 7  # Default to 7 days if unknown
        
        now = data.timestamp or datetime.now()
        delta = now - data.snow.last_snowfall
        days = delta.days
        
        # If snow fell today (within 24 hours), count as 0 days
        if delta.total_seconds() < 86400:  # Less than 24 hours
            return 0
        
        return days
    
    def _calculate_new_snow_points(
        self,
        new_snow_24h: float,
        new_snow_48h: float = None,
        days_since_snow: int = 0,
        precipitation_type: str = None,
        temperature: float = None
    ) -> float:
        """
        Calculate new snow points (0-100) with degradation logic.
        
        Rules:
        - Base points from new_snow_24h amount (in inches)
        - If no new snow today, estimate original snowfall from new_snow_48h
        - Degrades 20 points per day if no new snow
        - Goes to 0 if rain or temp > 30F (unless new snow occurred today)
        """
        # Convert cm to inches if needed (assume > 50 is in cm)
        new_snow_24h_inches = self._cm_to_inches_if_needed(new_snow_24h)
        
        # Determine the original snowfall amount for base points calculation
        # If new snow today, use that amount
        # If no new snow today but snow fell recently, estimate from 48h data
        if new_snow_24h_inches > 0:
            original_snowfall = new_snow_24h_inches
        elif new_snow_48h and new_snow_48h > 0:
            # Estimate: if 48h has snow but 24h doesn't, the snow fell 1-2 days ago
            # Use 48h amount as estimate of original snowfall
            original_snowfall = self._cm_to_inches_if_needed(new_snow_48h)
        else:
            original_snowfall = 0
        
        # Calculate base points from original snowfall amount
        if original_snowfall == 0:
            base_points = 0
        elif original_snowfall < 1:
            base_points = 0
        elif original_snowfall < 3:
            base_points = 50
        elif original_snowfall < 6:
            base_points = 60
        elif original_snowfall < 9:
            base_points = 70
        elif original_snowfall < 12:
            base_points = 85
        elif original_snowfall < 16:
            base_points = 90
        else:  # 16+ inches
            base_points = 100
        
        # Check for degradation conditions (rain or temp > 30F)
        has_rain = (precipitation_type and 
                   precipitation_type.lower() in ['rain', 'sleet'])
        temp_too_high = (temperature is not None and 
                        temperature > self.parameters.rain_temperature_threshold)
        
        # If new snow today, use base points (no degradation yet)
        if new_snow_24h_inches > 0:
            # Apply ice condition penalty if conditions deteriorated
            if has_rain or temp_too_high:
                return 0  # Ice condition - snow becomes unusable
            return base_points
        
        # No new snow today - apply daily degradation
        if has_rain or temp_too_high:
            return 0  # Ice condition from rain or high temp
        
        # Degrade 20 points per day since last snowfall
        # Days_since_snow is already calculated (0 if snow today, 1 if yesterday, etc.)
        degraded_points = base_points - (days_since_snow * self.parameters.new_snow_degradation_per_day)
        return max(0, degraded_points)
    
    def _calculate_base_depth_points(self, base_depth: float) -> float:
        """
        Calculate base depth points (0-100) based on depth in inches.
        
        Scoring:
        0-5 in = 0 pts
        5-10 in = 15 pts
        10-15 in = 35 pts
        15-20 in = 55 pts
        20-25 in = 65 pts
        25-35 in = 80 pts
        35-45 in = 90 pts
        45+ in = 100 pts
        """
        # Convert cm to inches if needed (assume > 50 is in cm)
        depth_inches = self._cm_to_inches_if_needed(base_depth)
        
        if depth_inches < 5:
            return 0
        elif depth_inches < 10:
            return 15
        elif depth_inches < 15:
            return 35
        elif depth_inches < 20:
            return 55
        elif depth_inches < 25:
            return 65
        elif depth_inches < 35:
            return 80
        elif depth_inches < 45:
            return 90
        else:  # 45+ inches
            return 100
    
    def _calculate_quality_points(self, snow_quality: str = None) -> float:
        """
        Calculate snow quality points (0-100) based on quality type.
        
        Scoring:
        sleet = 0 pts
        rain = 0 pts
        wet heavy snow = 25 pts
        regular density snow = 75 pts
        blower/champagne powder = 100 pts
        """
        if not snow_quality:
            return 50  # Default/unknown
        
        quality_lower = snow_quality.lower()
        
        # Exact matches
        if quality_lower in ['sleet']:
            return 0
        if quality_lower in ['rain']:
            return 0
        if quality_lower in ['wet heavy snow', 'wet', 'heavy', 'heavy snow']:
            return 25
        if quality_lower in ['regular density snow', 'regular', 'packed', 'groomed']:
            return 75
        if quality_lower in ['blower', 'champagne', 'powder', 'blower powder', 
                            'champagne powder', 'dry powder', 'light powder']:
            return 100
        
        # Fuzzy matching for common variations
        if 'powder' in quality_lower or 'champagne' in quality_lower or 'blower' in quality_lower:
            return 100
        if 'wet' in quality_lower or 'heavy' in quality_lower:
            return 25
        if 'packed' in quality_lower or 'regular' in quality_lower or 'groomed' in quality_lower:
            return 75
        if 'ice' in quality_lower or 'icy' in quality_lower:
            return 15  # Icy is worse than wet heavy
        if 'slush' in quality_lower:
            return 30  # Slightly better than wet heavy
        
        return 50  # Default for unknown quality
    
    def _calculate_temperature_points(self, temperature: float) -> float:
        """
        Calculate temperature points (0-100) based on temperature in Fahrenheit.
        
        Scoring:
        under 0F = 0 pts
        0-5F = 25 pts
        5-10F = 35 pts
        10-15F = 50 pts
        15-25F = 100 pts
        25-30F = 90 pts
        30-35F = 85 pts
        35-40F = 70 pts
        40-45F = 75 pts
        45-50F = 90 pts
        50-75F = 100 pts
        75-85F = 90 pts
        85+F = 80 pts
        """
        # Convert Celsius to Fahrenheit if needed (assume < -20 or > 50 is in C)
        temp_f = self._celsius_to_fahrenheit_if_needed(temperature)
        
        if temp_f < 0:
            return 0
        elif temp_f < 5:
            return 25
        elif temp_f < 10:
            return 35
        elif temp_f < 15:
            return 50
        elif temp_f < 25:
            return 100
        elif temp_f < 30:
            return 90
        elif temp_f < 35:
            return 85
        elif temp_f < 40:
            return 70
        elif temp_f < 45:
            return 75
        elif temp_f < 50:
            return 90
        elif temp_f < 75:
            return 100
        elif temp_f < 85:
            return 90
        else:  # 85+F
            return 80
    
    def _calculate_wind_points(self, wind_speed: float, wind_gust: float = None) -> float:
        """
        Calculate wind points (0-100) based on wind speed in mph.
        
        Scoring:
        0-5 mph = 100 pts
        5-10 mph = 90 pts
        10-15 mph = 75 pts
        15-20 mph = 50 pts
        20-25 mph = 20 pts
        25+ mph = 0 pts
        """
        # Use gust if available, otherwise regular wind speed
        effective_wind = wind_gust if wind_gust else wind_speed
        
        # Convert km/h to mph if needed (assume > 50 is in km/h)
        wind_mph = self._kmh_to_mph_if_needed(effective_wind)
        
        if wind_mph < 5:
            return 100
        elif wind_mph < 10:
            return 90
        elif wind_mph < 15:
            return 75
        elif wind_mph < 20:
            return 50
        elif wind_mph < 25:
            return 20
        else:  # 25+ mph
            return 0
    
    def _cm_to_inches_if_needed(self, value: float) -> float:
        """Convert cm to inches if value seems to be in cm (> 50)"""
        if value > 50:  # Likely in cm
            return value / 2.54
        return value  # Assume already in inches
    
    def _celsius_to_fahrenheit_if_needed(self, value: float) -> float:
        """Convert Celsius to Fahrenheit if value seems to be in C"""
        # Common skiing temperatures in F are typically -20 to 60F
        # If we see something like -10 to 35, it's likely Celsius
        # If we see something very cold like -40 or very warm like 80+, assume F
        if -40 <= value <= 40:
            # This range could be either, but skiing temps are rarely above 60F
            # If it's in reasonable skiing range for Celsius (-10 to 35C), convert
            if -10 <= value <= 35:
                return (value * 9/5) + 32
        # Otherwise assume already in Fahrenheit
        return value
    
    def _kmh_to_mph_if_needed(self, value: float) -> float:
        """Convert km/h to mph if value seems to be in km/h (> 50)"""
        if value > 50:  # Likely in km/h
            return value / 1.60934
        return value  # Assume already in mph
    
    def _points_to_rating(self, total_points: float) -> ConditionRating:
        """Convert total weighted points (0-100) to ConditionRating enum"""
        if total_points >= self.parameters.blower_threshold:
            return ConditionRating.BLOWER
        elif total_points >= self.parameters.perfect_threshold:
            return ConditionRating.PERFECT
        elif total_points >= self.parameters.excellent_threshold:
            return ConditionRating.EXCELLENT
        elif total_points >= self.parameters.good_threshold:
            return ConditionRating.GOOD
        elif total_points >= self.parameters.fair_threshold:
            return ConditionRating.FAIR
        elif total_points >= self.parameters.poor_threshold:
            return ConditionRating.POOR
        else:
            return ConditionRating.BAD
    
    def _calculate_dynamic_weights(self, new_snow_inches: float) -> Dict:
        """
        Calculate dynamic weights based on new snow amount.
        
        If new snow > 12in, increase new_snow weight by 1% per inch above 12in (max 60%).
        Reduce other weights evenly (each reduces 0.25% for each 1% increase in new_snow).
        
        Args:
            new_snow_inches: New snow in last 24h (in inches)
            
        Returns:
            Dictionary of adjusted weights (as decimals, e.g., 0.40 for 40%)
        """
        # Start with base weights
        adjusted_weights = {
            'new_snow': self.weights.new_snow_weight,
            'base_depth': self.weights.snow_depth_weight,
            'quality': self.weights.snow_quality_weight,
            'temperature': self.weights.temperature_weight,
            'wind': self.weights.wind_weight
        }
        
        # If new snow > 12in, adjust weights
        if new_snow_inches > 12.0:
            # Calculate how many inches above 12in
            inches_above_threshold = new_snow_inches - 12.0
            
            # Increase new_snow weight by 1% per inch above 12in (max 60% = 0.60)
            weight_increase = min(inches_above_threshold * 0.01, 0.60 - adjusted_weights['new_snow'])
            adjusted_weights['new_snow'] += weight_increase
            
            # Cap at 60% maximum
            adjusted_weights['new_snow'] = min(adjusted_weights['new_snow'], 0.60)
            
            # Reduce other weights evenly
            # Each reduces by 0.25% for each 1% increase in new_snow
            # So if new_snow increases by weight_increase, each other reduces by weight_increase * 0.25
            weight_decrease_per_param = weight_increase * 0.25
            
            # Calculate total weight that needs to be distributed from others
            total_to_reduce = weight_increase
            
            # Reduce each of the 4 other parameters
            other_params = ['base_depth', 'quality', 'temperature', 'wind']
            for param in other_params:
                adjusted_weights[param] -= weight_decrease_per_param
                adjusted_weights[param] = max(0.0, adjusted_weights[param])  # Don't go below 0
            
            # Normalize to ensure weights sum to 1.0 (safety check)
            total = sum(adjusted_weights.values())
            if abs(total - 1.0) > 0.001:
                # Normalize
                for key in adjusted_weights:
                    adjusted_weights[key] = adjusted_weights[key] / total
        
        return adjusted_weights
    
    def _weights_to_dict(self) -> Dict:
        """Convert base weights to dictionary for display"""
        return {
            'new_snow': self.weights.new_snow_weight,
            'base_depth': self.weights.snow_depth_weight,
            'quality': self.weights.snow_quality_weight,
            'temperature': self.weights.temperature_weight,
            'wind': self.weights.wind_weight
        }
    
    def _get_degradation_info(
        self,
        new_snow_24h: float,
        new_snow_48h: float = None,
        days_since_snow: int = 0,
        precipitation_type: str = None,
        temperature: float = None
    ) -> Dict:
        """Get information about degradation applied"""
        new_snow_24h_inches = self._cm_to_inches_if_needed(new_snow_24h)
        
        # Determine original snowfall amount
        if new_snow_24h_inches > 0:
            original_snowfall = new_snow_24h_inches
        elif new_snow_48h and new_snow_48h > 0:
            original_snowfall = self._cm_to_inches_if_needed(new_snow_48h)
        else:
            original_snowfall = 0
        
        has_rain = (precipitation_type and 
                   precipitation_type.lower() in ['rain', 'sleet'])
        temp_too_high = (temperature is not None and 
                        temperature > self.parameters.rain_temperature_threshold)
        
        info = {
            'days_since_snow': days_since_snow,
            'new_snow_24h_inches': new_snow_24h_inches,
            'original_snowfall_inches': original_snowfall,
            'degradation_applied': False
        }
        
        if new_snow_24h_inches == 0 and days_since_snow > 0 and original_snowfall > 0:
            info['degradation_applied'] = True
            info['points_lost'] = days_since_snow * self.parameters.new_snow_degradation_per_day
            # Calculate what base points would have been
            if original_snowfall < 1:
                base = 0
            elif original_snowfall < 3:
                base = 50
            elif original_snowfall < 6:
                base = 60
            elif original_snowfall < 9:
                base = 70
            elif original_snowfall < 12:
                base = 85
            elif original_snowfall < 16:
                base = 90
            else:
                base = 100
            info['original_base_points'] = base
        
        if has_rain:
            info['ice_condition_rain'] = True
        if temp_too_high:
            info['ice_condition_temp'] = True
            info['temperature_f'] = self._celsius_to_fahrenheit_if_needed(temperature)
        
        return info
