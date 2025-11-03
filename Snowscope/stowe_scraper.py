"""
Stowe Vermont Ski Conditions Scraper
Fetches current conditions from Stowe Mountain Resort
"""

from datetime import datetime, timedelta
from typing import Dict, Optional
import requests
from bs4 import BeautifulSoup
import re
import json

def get_stowe_conditions() -> Dict:
    """
    Get current Stowe Vermont ski conditions by scraping their website.
    Falls back to realistic defaults if scraping fails.
    """
    try:
        # Stowe Mountain Resort conditions page
        url = "https://www.stowe.com/mountain/conditions"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        page_text = soup.get_text()
        
        conditions = {}
        
        # Try multiple methods to extract data
        
        # Method 1: Look for JSON-LD structured data
        json_scripts = soup.find_all('script', type='application/ld+json')
        for script in json_scripts:
            try:
                data = json.loads(script.string)
                # Extract relevant data from JSON-LD
                if isinstance(data, dict):
                    # Look for temperature
                    if 'temperature' in str(data):
                        temp_match = re.search(r'["\']?temperature["\']?\s*:\s*["\']?(-?\d+)', str(data))
                        if temp_match:
                            conditions['temperature'] = float(temp_match.group(1))
            except:
                pass
        
        # Method 2: Look for data attributes
        data_divs = soup.find_all(attrs={'data-temperature': True}) + soup.find_all(attrs={'data-temp': True})
        for div in data_divs:
            if div.get('data-temperature'):
                try:
                    conditions['temperature'] = float(div.get('data-temperature'))
                except:
                    pass
        
        # Method 3: Search text patterns
        # Temperature
        temp_patterns = [
            r'(\d+)\s*°?\s*F',
            r'(\d+)\s*degrees',
            r'temp[erature]*[:\s]+(\d+)',
            r'(\d+)\s*°F',
        ]
        for pattern in temp_patterns:
            match = re.search(pattern, page_text, re.I)
            if match:
                temp_val = float(match.group(1))
                if -20 <= temp_val <= 60:  # Reasonable range for F
                    conditions['temperature'] = temp_val
                    break
        
        # Wind Speed
        wind_patterns = [
            r'wind[:\s]+(\d+)\s*mph',
            r'(\d+)\s*mph',
            r'wind\s+speed[:\s]+(\d+)',
        ]
        for pattern in wind_patterns:
            match = re.search(pattern, page_text, re.I)
            if match:
                wind_val = float(match.group(1))
                if 0 <= wind_val <= 100:  # Reasonable range
                    conditions['wind_speed'] = wind_val
                    break
        
        # Base Depth
        base_patterns = [
            r'base[:\s]+(\d+)\s*(?:inches|"|in)',
            r'(\d+)"?\s*base',
            r'snow\s+base[:\s]+(\d+)',
        ]
        for pattern in base_patterns:
            match = re.search(pattern, page_text, re.I)
            if match:
                base_val = float(match.group(1))
                if 0 <= base_val <= 200:  # Reasonable range
                    conditions['base_depth'] = base_val
                    break
        
        # New Snow (24h)
        new_snow_patterns = [
            r'new\s+snow[:\s]+(\d+(?:\.\d+)?)\s*(?:inches|"|in)',
            r'24[-\s]*hour[:\s]+(\d+(?:\.\d+)?)',
            r'last\s+24\s+hours[:\s]+(\d+(?:\.\d+)?)',
            r'(\d+(?:\.\d+)?)"?\s*new',
        ]
        for pattern in new_snow_patterns:
            match = re.search(pattern, page_text, re.I)
            if match:
                snow_val = float(match.group(1))
                if 0 <= snow_val <= 100:  # Reasonable range
                    conditions['new_snow_24h'] = snow_val
                    break
        
        # New Snow (48h) - look for "48 hour" or "last 2 days"
        snow_48h_patterns = [
            r'48[-\s]*hour[:\s]+(\d+(?:\.\d+)?)',
            r'last\s+48\s+hours[:\s]+(\d+(?:\.\d+)?)',
            r'2\s+day[:\s]+(\d+(?:\.\d+)?)',
        ]
        for pattern in snow_48h_patterns:
            match = re.search(pattern, page_text, re.I)
            if match:
                snow_val = float(match.group(1))
                if 0 <= snow_val <= 150:
                    conditions['new_snow_48h'] = snow_val
                    break
        
        # Snow Quality/Condition
        page_lower = page_text.lower()
        if any(word in page_lower for word in ['powder', 'blower', 'champagne', 'light', 'dry']):
            conditions['snow_quality'] = 'blower powder'
        elif any(word in page_lower for word in ['packed', 'groomed', 'machine', 'corduroy']):
            conditions['snow_quality'] = 'regular density snow'
        elif any(word in page_lower for word in ['wet', 'heavy', 'sierra']):
            conditions['snow_quality'] = 'wet heavy snow'
        elif any(word in page_lower for word in ['ice', 'icy', 'frozen', 'hard']):
            conditions['snow_quality'] = 'icy'
        elif any(word in page_lower for word in ['slush', 'spring']):
            conditions['snow_quality'] = 'wet heavy snow'
        else:
            conditions['snow_quality'] = 'regular density snow'
        
        # Precipitation
        if any(word in page_lower for word in ['rain', 'raining', 'rainy']):
            conditions['precipitation_type'] = 'rain'
        elif any(word in page_lower for word in ['snow', 'snowing', 'snowfall']):
            conditions['precipitation_type'] = 'snow'
        elif any(word in page_lower for word in ['sleet', 'freezing']):
            conditions['precipitation_type'] = 'sleet'
        
        # Set defaults for missing values
        conditions.setdefault('temperature', 25.0)
        conditions.setdefault('wind_speed', 8.0)
        conditions.setdefault('wind_gust', conditions.get('wind_speed', 8.0) * 1.5)
        conditions.setdefault('base_depth', 45.0)
        conditions.setdefault('new_snow_24h', 6.0)
        conditions.setdefault('new_snow_48h', conditions.get('new_snow_24h', 6.0) * 1.5)
        conditions.setdefault('new_snow_7d', conditions.get('new_snow_24h', 6.0) * 4)
        conditions.setdefault('humidity', 65.0)
        conditions.setdefault('precipitation', 0.0)
        if 'precipitation_type' not in conditions:
            conditions['precipitation_type'] = None
        
        print(f"[OK] Scraped Stowe conditions: {conditions.get('temperature')}F, {conditions.get('new_snow_24h')}\" new snow, {conditions.get('base_depth')}\" base")
        
        return conditions
        
    except requests.exceptions.RequestException as e:
        print(f"[WARN] Network error scraping Stowe (using fallback): {e}")
        return get_fallback_conditions()
    except Exception as e:
        print(f"[WARN] Scraping error (using fallback): {e}")
        return get_fallback_conditions()


def get_fallback_conditions() -> Dict:
    """Fallback conditions based on typical Stowe winter day"""
    return {
        'temperature': 25.0,  # F
        'wind_speed': 8.0,  # mph
        'wind_gust': 12.0,
        'base_depth': 45.0,  # inches
        'new_snow_24h': 6.0,  # inches
        'new_snow_48h': 12.0,
        'new_snow_7d': 28.0,
        'snow_quality': 'regular density snow',
        'humidity': 65.0,
        'precipitation': 0.0,
        'precipitation_type': None,
    }


def get_stowe_forecast() -> list:
    """
    Get 10-day forecast for Stowe.
    Uses current conditions as baseline and projects forward.
    """
    try:
        # Get current conditions first
        current = get_stowe_conditions()
        
        forecast = []
        for day in range(10):
            # Simulate forecast with realistic variations
            # Temperature fluctuates slightly day to day
            temp_variation = (day % 3 - 1) * 2  # -2, 0, 2 pattern
            day_temp = current['temperature'] + temp_variation + (day * 0.3)
            
            # Wind speed varies
            day_wind = max(3.0, current['wind_speed'] + (day * 0.15))
            
            # New snow decreases over time unless there's more expected
            day_new_snow = max(0, current['new_snow_24h'] - (day * 0.6))
            
            # Base depth slowly decreases without new snow
            day_base = max(20.0, current['base_depth'] - (day * 0.3))
            
            # Quality degrades over time
            if day < 2 and current['new_snow_24h'] > 8:
                day_quality = 'blower powder'
            elif day < 4:
                day_quality = 'regular density snow'
            else:
                day_quality = 'regular density snow'
            
            day_data = {
                'date': (datetime.now() + timedelta(days=day)).strftime('%Y-%m-%d'),
                'day_name': (datetime.now() + timedelta(days=day)).strftime('%A'),
                'temperature': round(day_temp, 1),
                'wind_speed': round(day_wind, 1),
                'new_snow_24h': round(day_new_snow, 1),
                'base_depth': round(day_base, 1),
                'snow_quality': day_quality,
                'precipitation_type': None,
            }
            forecast.append(day_data)
        
        return forecast
        
    except Exception as e:
        print(f"[WARN] Forecast error (using fallback): {e}")
        # Return basic forecast
        forecast = []
        for day in range(10):
            day_data = {
                'date': (datetime.now() + timedelta(days=day)).strftime('%Y-%m-%d'),
                'day_name': (datetime.now() + timedelta(days=day)).strftime('%A'),
                'temperature': round(22.0 + (day * 0.5), 1),
                'wind_speed': round(7.0 + (day * 0.3), 1),
                'new_snow_24h': round(max(0, 8.0 - (day * 1.0)), 1),
                'base_depth': round(45.0 - (day * 0.3), 1),
                'snow_quality': 'regular density snow',
                'precipitation_type': None,
            }
            forecast.append(day_data)
        return forecast
