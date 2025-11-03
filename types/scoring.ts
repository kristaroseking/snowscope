// Types for ski condition scoring API

export interface ScoringWeatherData {
  temperature: number; // Fahrenheit
  feels_like: number;
  wind_speed: number; // mph
  wind_gust?: number;
  wind_direction?: number;
  humidity: number;
  precipitation: number;
  precipitation_type?: string | null;
  visibility?: number;
}

export interface ScoringSnowData {
  base_depth: number; // inches
  new_snow_24h: number; // inches
  new_snow_48h?: number;
  new_snow_7d?: number;
  snow_quality: string; // e.g., 'blower powder', 'regular density snow', 'icy'
  surface_condition?: string;
}

export interface SkiConditionRatingRequest {
  temperature: number;
  feels_like: number;
  wind_speed: number;
  wind_gust?: number;
  wind_direction?: number;
  humidity: number;
  precipitation: number;
  precipitation_type?: string | null;
  visibility?: number;
  base_depth: number;
  new_snow_24h: number;
  new_snow_48h?: number;
  new_snow_7d?: number;
  snow_quality: string;
  surface_condition?: string;
}

export interface ComponentScore {
  score: number;
  weight: number;
  max_possible: number;
  percentage: number;
}

export interface SkiConditionRatingResponse {
  overall_score: number;
  rating: string; // e.g., 'BLOWER', 'EPIC', 'GREAT', 'GOOD', 'FAIR', 'POOR'
  rating_emoji: string;
  component_scores: {
    new_snow: ComponentScore;
    snow_depth: ComponentScore;
    snow_quality: ComponentScore;
    temperature: ComponentScore;
    wind: ComponentScore;
  };
  details: {
    conditions_summary: string;
    best_for: string[];
    considerations: string[];
  };
}
