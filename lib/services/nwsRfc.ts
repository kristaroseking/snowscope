// NWS River Forecast Center (RFC) snow data integration
// RFC snow pages provide detailed snow depth, SWE, and precipitation data

export interface RFCSnowData {
  siteName: string;
  siteCode: string;
  elevation: number;
  snowDepth?: number; // inches
  swe?: number; // snow water equivalent, inches
  newSnow24h?: number;
  newSnow48h?: number;
  precipitation?: number;
  temperature?: number;
  timestamp: string;
}

/**
 * NWS RFC regions:
 * - NERFC: Northeast RFC (covers Vermont, New England)
 * - MARFC: Middle Atlantic RFC
 * - SERFC: Southeast RFC
 * - OHRFC: Ohio RFC
 * - LMRFC: Lower Mississippi RFC
 * - NCRFC: North Central RFC
 * - CBRFC: Colorado Basin RFC (covers Colorado resorts)
 * - NWRFC: Northwest RFC (covers Washington, Oregon, Idaho)
 * - CNRFC: California Nevada RFC (covers California resorts)
 * - WGRFC: West Gulf RFC
 * - ABRFC: Arkansas Red Basin RFC
 */

export type RFCRegion =
  | "nerfc"
  | "marfc"
  | "serfc"
  | "ohrfc"
  | "lmrfc"
  | "ncrfc"
  | "cbrfc"
  | "nwrfc"
  | "cnrfc"
  | "wgrfc"
  | "abrfc";

/**
 * Get RFC snow data for a specific site
 * Note: This requires web scraping as RFCs don't provide APIs
 * Each RFC has different page structures
 */
export async function fetchRFCSnowData(
  rfcRegion: RFCRegion,
  siteCode?: string
): Promise<RFCSnowData[] | null> {
  try {
    // Each RFC has different URLs and formats
    const rfcUrls: Record<RFCRegion, string> = {
      nerfc: "https://www.weather.gov/nerfc/",
      marfc: "https://www.weather.gov/marfc/",
      serfc: "https://www.weather.gov/serfc/",
      ohrfc: "https://www.weather.gov/ohrfc/",
      lmrfc: "https://www.weather.gov/lmrfc/",
      ncrfc: "https://www.weather.gov/ncrfc/",
      cbrfc: "https://www.cbrfc.noaa.gov/",
      nwrfc: "https://www.nwrfc.noaa.gov/",
      cnrfc: "https://www.cnrfc.noaa.gov/",
      wgrfc: "https://www.weather.gov/wgrfc/",
      abrfc: "https://www.weather.gov/abrfc/",
    };

    // Example: NERFC snow data page
    // https://www.weather.gov/nerfc/snowfall
    // This would need to be scraped with a library like Cheerio

    console.warn(
      `RFC snow data scraping not yet implemented for ${rfcRegion}`
    );
    console.info(`RFC base URL: ${rfcUrls[rfcRegion]}`);

    // Implementation would involve:
    // 1. Fetching the HTML from the RFC snow page
    // 2. Parsing the table/data with Cheerio or similar
    // 3. Extracting snow depth, SWE, and other metrics
    // 4. Returning structured data

    return null;
  } catch (error) {
    console.error("Error fetching RFC snow data:", error);
    return null;
  }
}

/**
 * Get SNOTEL data (Snow Telemetry) from NRCS
 * This is related but separate from RFC data
 * SNOTEL provides automated snow measurements at high elevations
 */
export async function fetchSNOTELData(
  stationId: string
): Promise<any | null> {
  try {
    // NRCS SNOTEL data can be accessed via their web services
    // Example: https://wcc.sc.egov.usda.gov/awdbWebService/
    // Or CSV downloads from: https://wcc.sc.egov.usda.gov/reportGenerator/

    const url = `https://wcc.sc.egov.usda.gov/awdbWebService/services?` +
      `stationTriplet=${stationId}`;

    console.warn("SNOTEL integration not yet implemented");
    console.info(`Station: ${stationId}`);

    // This would require SOAP/REST API integration with NRCS
    return null;
  } catch (error) {
    console.error("Error fetching SNOTEL data:", error);
    return null;
  }
}

/**
 * Helper function to find RFC region for a given location
 */
export function getRFCRegionForLocation(
  latitude: number,
  longitude: number
): RFCRegion {
  // Simplified mapping - would need more precise boundaries
  if (latitude >= 41 && latitude <= 47 && longitude >= -73 && longitude <= -67) {
    return "nerfc"; // New England
  }
  if (latitude >= 36 && latitude <= 42 && longitude >= -112 && longitude <= -105) {
    return "cbrfc"; // Colorado Basin
  }
  if (latitude >= 36 && latitude <= 42 && longitude >= -125 && longitude <= -114) {
    return "cnrfc"; // California/Nevada
  }
  if (latitude >= 42 && latitude <= 49 && longitude >= -125 && longitude <= -111) {
    return "nwrfc"; // Northwest
  }

  // Default to appropriate region
  return "nerfc";
}
