// Resort and location types
export type Region = "Northeast USA" | "Western USA" | "Canada" | "International";

export interface Lift {
  name: string;
  type: "Gondola" | "High-Speed Quad" | "Fixed Quad" | "Triple" | "Double" | "Surface";
  topElevation: number;
  bottomElevation: number;
  windExposure: "High" | "Moderate" | "Low";
}

export interface Resort {
  id: string;
  name: string;
  state: string;
  country: string;
  region: Region;
  latitude: number;
  longitude: number;
  elevations: {
    base: number;
    mid: number;
    summit: number;
  };
  lifts?: Lift[];
  blogUrl?: string; // Optional blog URL (Blogspot, WordPress, etc.)
  passes?: ("Epic" | "Ikon" | "Indy" | "Independent")[]; // Pass affiliations
  season?: {
    openingDay: string; // Format: "YYYY-MM-DD"
    closingDay: string; // Format: "YYYY-MM-DD"
    typicalOpening: string; // Format: "MM-DD" (e.g., "11-15" for mid-November)
    typicalClosing: string; // Format: "MM-DD"
  };
  liftOpeningTime?: string; // Format: "HH:MM AM/PM" (e.g., "8:30 AM")
  parkingInstructions?: string; // Parking information and instructions
  parkingCost?: "free" | "paid"; // Whether parking is free or paid
}

// Weather data types
export interface CurrentConditions {
  temp: number;
  feelsLike: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  visibility: number;
  snowfall24h: number;
  snowfall48h: number;
  snowDepth?: number; // Base depth in inches from weather sources
  weatherDescription: string;
  weatherIcon: string;
  timestamp: number;
}

export interface ElevationConditions {
  base: CurrentConditions;
  mid: CurrentConditions;
  summit: CurrentConditions;
}

export interface HourlyForecast {
  time: string; // ISO 8601 timestamp
  temp: number;
  windSpeed: number;
  windDirection?: number; // 0-360 degrees
  snowAccumulation: number;
  weatherDescription: string;
  weatherIcon: string;
  cloudCover: number; // 0-100 percentage
  precipitation: number; // mm
}

export interface DailyForecast {
  date: string;
  tempHigh: number;
  tempLow: number;
  snowAccumulation: number;
  windSpeed: number;
  weatherDescription: string;
  weatherIcon: string;
}

export interface ElevationForecast {
  base: DailyForecast[];
  mid: DailyForecast[];
  summit: DailyForecast[];
}

export interface ElevationHourlyForecast {
  base: HourlyForecast[];
  mid: HourlyForecast[];
  summit: HourlyForecast[];
}

export interface ResortWeather {
  resort: Resort;
  current: ElevationConditions;
  forecast: ElevationForecast;
  hourly?: ElevationHourlyForecast;
  lastUpdated: number;
}

// API response types
export interface WeatherApiResponse {
  success: boolean;
  data?: ResortWeather;
  error?: string;
}

// Blog types
export interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
}

export interface BlogFeedResponse {
  success: boolean;
  posts?: BlogPost[];
  error?: string;
}

// Live lift status types
export type LiftStatus = "Open" | "Closed" | "On-Hold" | "Scheduled";

export interface LiveLiftStatus {
  name: string;
  status: LiftStatus;
  type: string;
  groomed: boolean;
  lastUpdated: string;
  // Detailed specifications
  manufacturer?: string;
  yearBuilt?: number;
  speed?: number; // feet per minute
  rideTime?: number; // minutes
  length?: number; // feet
  verticalRise?: number; // feet
  capacity?: number; // riders per hour
  description?: string;
}

// Trail status types
export type TrailStatus = "Open" | "Closed" | "On-Hold" | "Scheduled";
export type TrailDifficulty = "Green Circle" | "Blue Square" | "Black Diamond" | "Double Black Diamond" | "Terrain Park" | "Glades";

export interface LiveTrailStatus {
  name: string;
  status: TrailStatus;
  difficulty: TrailDifficulty;
  groomed: boolean;
  lastUpdated: string;
  // Track status changes for filtering
  isNewlyOpened?: boolean; // Opened today or recently
  isNewlyClosed?: boolean; // Closed today or recently
}

export interface LiftStatusResponse {
  success: boolean;
  data?: {
    lifts: LiveLiftStatus[];
    trails?: LiveTrailStatus[]; // Add trails to response
    lastUpdated: string;
    resortId: number;
  };
  error?: string;
}
