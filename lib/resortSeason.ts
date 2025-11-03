import { Resort } from "@/types";

/**
 * Check if a resort is currently in season (open for skiing/riding)
 */
export function isResortInSeason(resort: Resort): boolean {
  if (!resort.season) {
    // If no season info, assume open (most conservative approach)
    return true;
  }

  const now = new Date();
  const openingDate = new Date(resort.season.openingDay);
  const closingDate = new Date(resort.season.closingDay);

  return now >= openingDate && now <= closingDate;
}

/**
 * Get the resort's season status as a human-readable string
 */
export function getResortSeasonStatus(resort: Resort): {
  isOpen: boolean;
  message: string;
} {
  if (!resort.season) {
    return {
      isOpen: true,
      message: "Season dates not available",
    };
  }

  const now = new Date();
  const openingDate = new Date(resort.season.openingDay);
  const closingDate = new Date(resort.season.closingDay);

  if (now < openingDate) {
    const daysUntilOpening = Math.ceil(
      (openingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      isOpen: false,
      message: `Opens ${openingDate.toLocaleDateString()} (${daysUntilOpening} days)`,
    };
  }

  if (now > closingDate) {
    return {
      isOpen: false,
      message: `Season ended ${closingDate.toLocaleDateString()}`,
    };
  }

  const daysUntilClosing = Math.ceil(
    (closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilClosing <= 7) {
    return {
      isOpen: true,
      message: `Closes in ${daysUntilClosing} days (${closingDate.toLocaleDateString()})`,
    };
  }

  return {
    isOpen: true,
    message: `Season through ${closingDate.toLocaleDateString()}`,
  };
}

/**
 * Get days remaining in the season
 */
export function getDaysRemaining(resort: Resort): number | null {
  if (!resort.season) return null;

  const now = new Date();
  const closingDate = new Date(resort.season.closingDay);

  if (now > closingDate) return 0;

  return Math.ceil((closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
