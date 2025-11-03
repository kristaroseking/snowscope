// Calculate sunrise and sunset times based on location and date
// Using accurate solar position algorithm accounting for timezone and DST

export interface SunTimes {
  sunrise: number; // Hour in 24-hour format (decimal, e.g., 6.5 = 6:30 AM)
  sunset: number;  // Hour in 24-hour format (decimal, e.g., 18.5 = 6:30 PM)
  dawn: number;    // Civil twilight begins (6 degrees below horizon)
  dusk: number;    // Civil twilight ends (6 degrees below horizon)
}

// Format decimal hour to 12-hour time string (e.g., 6.5 -> "6:30am")
export function formatTimeString(hour: number): string {
  const hours = Math.floor(hour);
  const minutes = Math.round((hour % 1) * 60);
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, '0')}${period}`;
}

export function getSunriseSunset(latitude: number, longitude: number, date: Date = new Date()): SunTimes {
  // Use SunCalc-like algorithm for accurate sunrise/sunset
  const PI = Math.PI;
  const rad = PI / 180;
  const dayMs = 1000 * 60 * 60 * 24;
  const J1970 = 2440588;
  const J2000 = 2451545;

  // Get Julian date
  function toJulian(date: Date) {
    return date.getTime() / dayMs - 0.5 + J1970;
  }

  function fromJulian(j: number) {
    return new Date((j + 0.5 - J1970) * dayMs);
  }

  function toDays(date: Date) {
    return toJulian(date) - J2000;
  }

  const lw = rad * -longitude;
  const phi = rad * latitude;
  const d = toDays(date);
  const n = Math.round(d - lw / (2 * PI));
  const ds = n + lw / (2 * PI);

  const M = (357.5291 + 0.98560028 * ds) * rad;
  const C = (1.9148 * Math.sin(M) + 0.0200 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) * rad;
  const L = (M + C + (180 * rad) + (102.9372 * rad));

  const dec = Math.asin(Math.sin(L) * Math.sin(23.44 * rad));
  const Jtransit = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);

  // Sun altitude for sunrise/sunset (-0.833 degrees)
  const h0 = -0.833 * rad;
  const cosH0 = (Math.sin(h0) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));

  // Check for polar day/night
  if (cosH0 > 1) {
    return { sunrise: 0, sunset: 0, dawn: 0, dusk: 0 }; // Polar night
  }
  if (cosH0 < -1) {
    return { sunrise: 0, sunset: 24, dawn: 0, dusk: 24 }; // Polar day
  }

  const H0 = Math.acos(cosH0);
  const Jset = Jtransit + H0 / (2 * PI);
  const Jrise = Jtransit - H0 / (2 * PI);

  // Calculate civil twilight (6 degrees below horizon)
  const h0Twilight = -6 * rad;
  const cosH0Twilight = (Math.sin(h0Twilight) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));

  let dawnHour = 0;
  let duskHour = 24;

  if (cosH0Twilight <= 1 && cosH0Twilight >= -1) {
    const H0Twilight = Math.acos(cosH0Twilight);
    const JdawnSet = Jtransit + H0Twilight / (2 * PI);
    const JdawnRise = Jtransit - H0Twilight / (2 * PI);

    const dawnDate = fromJulian(JdawnRise);
    const duskDate = fromJulian(JdawnSet);

    dawnHour = dawnDate.getHours() + dawnDate.getMinutes() / 60;
    duskHour = duskDate.getHours() + duskDate.getMinutes() / 60;
  }

  // Convert to local time
  const sunriseDate = fromJulian(Jrise);
  const sunsetDate = fromJulian(Jset);

  // Get hours in local time (accounts for timezone and DST)
  const sunriseHour = sunriseDate.getHours() + sunriseDate.getMinutes() / 60;
  const sunsetHour = sunsetDate.getHours() + sunsetDate.getMinutes() / 60;

  const result = {
    sunrise: sunriseHour,
    sunset: sunsetHour,
    dawn: dawnHour,
    dusk: duskHour
  };

  console.log('Sunrise/Sunset calculation:', {
    date: date.toLocaleDateString(),
    latitude,
    longitude,
    sunrise: result.sunrise,
    sunset: result.sunset,
    sunriseTime: `${Math.floor(result.sunrise)}:${Math.round((result.sunrise % 1) * 60).toString().padStart(2, '0')}`,
    sunsetTime: `${Math.floor(result.sunset)}:${Math.round((result.sunset % 1) * 60).toString().padStart(2, '0')}`
  });

  return result;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Helper to check if an hour is during daylight
export function isDaylightHour(hour: number, sunTimes: SunTimes): boolean {
  return hour >= Math.floor(sunTimes.sunrise) && hour <= Math.ceil(sunTimes.sunset);
}

// Get opacity for day/night shading with smooth transitions
export function getDayNightOpacity(hour: number, sunTimes: SunTimes): number {
  const { sunrise, sunset } = sunTimes;

  // Debug logging
  if (hour === 12) {
    console.log('Noon debug:', { hour, sunrise, sunset, sunriseHour: Math.floor(sunrise), sunsetHour: Math.floor(sunset) });
  }

  // Convert to hour boundaries
  const sunriseHour = Math.floor(sunrise);
  const sunsetHour = Math.floor(sunset);

  // Night time - darker shading
  if (hour < sunriseHour || hour > sunsetHour) {
    return 0.5;
  }

  // Sunrise transition hour - light shading
  if (hour === sunriseHour) {
    return 0.3;
  }

  // Sunset transition hour - light shading
  if (hour === sunsetHour) {
    return 0.3;
  }

  // Full daylight - no shading
  return 0;
}
