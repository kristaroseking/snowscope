import { LiveLiftStatus, LiveTrailStatus, TrailDifficulty } from "@/types";
import { getLiftDetails, getResortLifts } from "@/lib/liftDatabase";

interface ScraperResult {
  success: boolean;
  lifts?: LiveLiftStatus[];
  trails?: LiveTrailStatus[];
  lastUpdated?: string;
  error?: string;
}

/**
 * Maps trail difficulty string to TrailDifficulty type
 */
function mapTrailDifficulty(difficulty: string): TrailDifficulty {
  const lower = difficulty.toLowerCase();
  if (lower.includes("green") || lower.includes("easiest")) return "Green Circle";
  if (lower.includes("blue") || lower.includes("more difficult")) return "Blue Square";
  if (lower.includes("double") || lower.includes("expert")) return "Double Black Diamond";
  if (lower.includes("black") || lower.includes("most difficult")) return "Black Diamond";
  if (lower.includes("park") || lower.includes("terrain park")) return "Terrain Park";
  if (lower.includes("glade") || lower.includes("tree")) return "Glades";
  return "Blue Square"; // default
}

/**
 * Merges live status data with detailed lift specifications from our database
 */
function mergeLiftDetails(
  resortId: string,
  liftName: string,
  status: string,
  type: string,
  groomed: boolean,
  lastUpdated: string
): LiveLiftStatus {
  const details = getLiftDetails(resortId, liftName);

  return {
    name: liftName,
    status: status as any,
    type: details?.type || type,
    groomed,
    lastUpdated,
    // Add detailed specs if available
    manufacturer: details?.manufacturer,
    yearBuilt: details?.yearBuilt,
    speed: details?.speed,
    rideTime: details?.rideTime,
    length: details?.length,
    verticalRise: details?.verticalRise,
    capacity: details?.capacity,
    description: details?.description,
  };
}

// Stowe Mountain Resort scraper
export async function scrapeStowe(): Promise<ScraperResult> {
  try {
    const response = await fetch(
      "https://www.stowe.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const match = html.match(/FR\.TerrainStatusFeed\s*=\s*({[\s\S]*?});/);

    if (!match) {
      return { success: false, error: "Could not find lift status data" };
    }

    const terrainData = JSON.parse(match[1]);
    const lifts = terrainData.Lifts || [];
    const trails = terrainData.Trails || [];

    const liftStatus: LiveLiftStatus[] = lifts.map((lift: any) =>
      mergeLiftDetails(
        "stowe",
        lift.Name,
        lift.Status,
        lift.Type || "Unknown",
        lift.IsGroomed || false,
        terrainData.Date
      )
    );

    const trailStatus: LiveTrailStatus[] = trails.map((trail: any) => ({
      name: trail.Name,
      status: trail.Status as any,
      difficulty: mapTrailDifficulty(trail.Type || ""),
      groomed: trail.IsGroomed || false,
      lastUpdated: terrainData.Date,
    }));

    return {
      success: true,
      lifts: liftStatus,
      trails: trailStatus,
      lastUpdated: terrainData.Date,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape Stowe",
    };
  }
}

// Mad River Glen scraper
export async function scrapeMadRiverGlen(): Promise<ScraperResult> {
  try {
    const response = await fetch("https://www.madriverglen.com/conditions/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Look for lift status table or divs
    // Mad River Glen has a simpler structure - typically a table with lift names and status
    const lifts: LiveLiftStatus[] = [];

    const timestamp = new Date().toISOString();

    // Extract Single Chair status
    const singleChairMatch = html.match(
      /Single Chair.*?(?:Open|Closed|On Hold|Scheduled)/i
    );
    if (singleChairMatch) {
      const status = singleChairMatch[0].match(/Open|Closed|On Hold|Scheduled/i)?.[0] || "Unknown";
      lifts.push(
        mergeLiftDetails(
          "mad-river-glen",
          "Single Chair",
          status,
          "Fixed Grip Single",
          false,
          timestamp
        )
      );
    }

    // Extract Cricket Lift status
    const cricketMatch = html.match(
      /Cricket(?:\s+Lift)?.*?(?:Open|Closed|On Hold|Scheduled)/i
    );
    if (cricketMatch) {
      const status = cricketMatch[0].match(/Open|Closed|On Hold|Scheduled/i)?.[0] || "Unknown";
      lifts.push(
        mergeLiftDetails(
          "mad-river-glen",
          "Cricket Lift",
          status,
          "Surface Lift",
          false,
          timestamp
        )
      );
    }

    if (lifts.length === 0) {
      return { success: false, error: "Could not parse lift status" };
    }

    return {
      success: true,
      lifts,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape Mad River Glen",
    };
  }
}

// Jay Peak scraper
export async function scrapeJayPeak(): Promise<ScraperResult> {
  try {
    const response = await fetch(
      "https://jaypeakresort.com/skiing-riding/snow-report-maps/snow-report",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Jay Peak typically has lift status in a structured format
    // Look for common lift names and their status
    const lifts: LiveLiftStatus[] = [];
    const timestamp = new Date().toISOString();
    const liftNames = [
      "Tram",
      "Flyer",
      "Bonnie",
      "Metro",
      "Jet Triple",
      "Bonaventure Express",
      "Taxi",
      "Stateside",
    ];

    for (const liftName of liftNames) {
      const regex = new RegExp(
        `${liftName}.*?(?:Open|Closed|On Hold|Scheduled)`,
        "is"
      );
      const match = html.match(regex);
      if (match) {
        const status = match[0].match(/Open|Closed|On Hold|Scheduled/i)?.[0] || "Unknown";
        lifts.push(
          mergeLiftDetails(
            "jay-peak",
            liftName,
            status,
            liftName === "Tram" ? "Aerial Tram" : "Chairlift",
            false,
            timestamp
          )
        );
      }
    }

    if (lifts.length === 0) {
      return { success: false, error: "Could not parse lift status" };
    }

    return {
      success: true,
      lifts,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape Jay Peak",
    };
  }
}

// Sugarbush scraper
export async function scrapeSugarbush(): Promise<ScraperResult> {
  try {
    const response = await fetch("https://www.sugarbush.com/mountain/conditions", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const lifts: LiveLiftStatus[] = [];
    const timestamp = new Date().toISOString();

    // Sugarbush lifts across Lincoln Peak and Mt. Ellen
    const liftNames = [
      "Super Bravo Express",
      "Heaven's Gate",
      "North Lynx",
      "Castlerock Double",
      "Valley House Double",
      "Summit Express",
      "Inverness Quad",
    ];

    for (const liftName of liftNames) {
      const regex = new RegExp(
        `${liftName}.*?(?:Open|Closed|On Hold|Scheduled)`,
        "is"
      );
      const match = html.match(regex);
      if (match) {
        const status = match[0].match(/Open|Closed|On Hold|Scheduled/i)?.[0] || "Unknown";
        lifts.push(
          mergeLiftDetails(
            "sugarbush",
            liftName,
            status,
            "Chairlift",
            false,
            timestamp
          )
        );
      }
    }

    if (lifts.length === 0) {
      return { success: false, error: "Could not parse lift status" };
    }

    return {
      success: true,
      lifts,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape Sugarbush",
    };
  }
}

// Killington scraper
export async function scrapeKillington(): Promise<ScraperResult> {
  try {
    const response = await fetch(
      "https://www.killington.com/the-mountain/conditions-weather/lifts-trails-report/",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const lifts: LiveLiftStatus[] = [];
    const timestamp = new Date().toISOString();

    // Killington's major lifts
    const liftNames = [
      "K-1 Express Gondola",
      "Superstar Express",
      "Skye Peak Express",
      "North Ridge Triple",
      "Snowdon Express",
      "Canyon Express",
      "Ramshead Express",
    ];

    for (const liftName of liftNames) {
      const regex = new RegExp(
        `${liftName}.*?(?:Open|Closed|On Hold|Scheduled)`,
        "is"
      );
      const match = html.match(regex);
      if (match) {
        const status = match[0].match(/Open|Closed|On Hold|Scheduled/i)?.[0] || "Unknown";
        lifts.push(
          mergeLiftDetails(
            "killington",
            liftName,
            status,
            liftName.includes("Gondola") ? "Gondola" : "Chairlift",
            false,
            timestamp
          )
        );
      }
    }

    if (lifts.length === 0) {
      return { success: false, error: "Could not parse lift status" };
    }

    return {
      success: true,
      lifts,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape Killington",
    };
  }
}

// Sunday River scraper
export async function scrapeSundayRiver(): Promise<ScraperResult> {
  try {
    const response = await fetch(
      "https://www.sundayriver.com/lifts-and-trails-status",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const lifts: LiveLiftStatus[] = [];
    const timestamp = new Date().toISOString();

    const liftNames = [
      "Chondola",
      "Jordan Bowl Express",
      "Barker Mountain Express",
      "South Ridge Express",
      "Spruce Peak",
      "Aurora",
    ];

    for (const liftName of liftNames) {
      const regex = new RegExp(
        `${liftName}.*?(?:Open|Closed|On Hold|Scheduled)`,
        "is"
      );
      const match = html.match(regex);
      if (match) {
        const status = match[0].match(/Open|Closed|On Hold|Scheduled/i)?.[0] || "Unknown";
        lifts.push(
          mergeLiftDetails(
            "sunday-river",
            liftName,
            status,
            liftName === "Chondola" ? "Chondola" : "Chairlift",
            false,
            timestamp
          )
        );
      }
    }

    if (lifts.length === 0) {
      return { success: false, error: "Could not parse lift status" };
    }

    return {
      success: true,
      lifts,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape Sunday River",
    };
  }
}

// Mammoth scraper
export async function scrapeMammoth(): Promise<ScraperResult> {
  try {
    const response = await fetch(
      "https://www.mammothmountain.com/on-the-mountain/mountain-report",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const lifts: LiveLiftStatus[] = [];
    const timestamp = new Date().toISOString();

    const liftNames = [
      "Panorama Gondola",
      "Broadway Express",
      "Mill Café Express",
      "Face Lift Express",
      "Cloud Nine Express",
      "Chair 23",
      "Chair 22",
    ];

    for (const liftName of liftNames) {
      const regex = new RegExp(
        `${liftName}.*?(?:Open|Closed|On Hold|Scheduled)`,
        "is"
      );
      const match = html.match(regex);
      if (match) {
        const status = match[0].match(/Open|Closed|On Hold|Scheduled/i)?.[0] || "Unknown";
        lifts.push(
          mergeLiftDetails(
            "mammoth",
            liftName,
            status,
            liftName.includes("Gondola") ? "Gondola" : "Chairlift",
            false,
            timestamp
          )
        );
      }
    }

    if (lifts.length === 0) {
      return { success: false, error: "Could not parse lift status" };
    }

    return {
      success: true,
      lifts,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape Mammoth",
    };
  }
}

// Main scraper router
export async function scrapeLiftStatus(resortId: string): Promise<ScraperResult> {
  switch (resortId) {
    case "stowe":
      return scrapeStowe();
    case "mad-river-glen":
      return scrapeMadRiverGlen();
    case "jay-peak":
      return scrapeJayPeak();
    case "sugarbush":
      return scrapeSugarbush();
    case "killington":
      return scrapeKillington();
    case "sunday-river":
      return scrapeSundayRiver();
    case "mammoth":
      return scrapeMammoth();
    default:
      return {
        success: false,
        error: "Resort not supported for live lift status",
      };
  }
}
