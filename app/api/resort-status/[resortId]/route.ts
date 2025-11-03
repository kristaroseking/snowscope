import { NextRequest, NextResponse } from "next/server";
import { ResortStatus, ResortStatusResponse } from "@/types";

// Mock data for Banff Sunshine - realistic winter conditions
const banffSunshineMockData: ResortStatus = {
  resortId: "banff-sunshine",
  stats: {
    trailsOpen: 87,
    trailsTotal: 109,
    liftsOpen: 10,
    liftsTotal: 12,
    baseDepth: 95,
    seasonTotal: 312,
    lastUpdated: new Date().toISOString(),
  },
  lifts: [
    {
      name: "Gondola",
      status: "Open",
      type: "8-Person Gondola",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 17,
      verticalRise: 1660,
      capacity: 2000,
    },
    {
      name: "Standish Chairlift",
      status: "Open",
      type: "High-Speed Quad",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 7,
      verticalRise: 1870,
      capacity: 2400,
    },
    {
      name: "Angel Express",
      status: "Open",
      type: "High-Speed Quad",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 5,
      verticalRise: 1100,
      capacity: 2400,
    },
    {
      name: "Wolverine Express",
      status: "Open",
      type: "High-Speed Quad",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 4.8,
      verticalRise: 1000,
      capacity: 2400,
    },
    {
      name: "Goat's Eye Express",
      status: "Open",
      type: "High-Speed Quad",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 6.5,
      verticalRise: 1860,
      capacity: 2400,
    },
    {
      name: "Jackrabbit",
      status: "Open",
      type: "Fixed Triple",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 8,
      verticalRise: 1200,
      capacity: 1200,
    },
    {
      name: "Teepee Town",
      status: "Open",
      type: "Fixed Triple",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 6,
      verticalRise: 950,
      capacity: 1200,
    },
    {
      name: "Divide Chair",
      status: "Open",
      type: "Fixed Double",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 7,
      verticalRise: 850,
      capacity: 900,
    },
    {
      name: "Strawberry Express",
      status: "Open",
      type: "High-Speed Quad",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 5.5,
      verticalRise: 1100,
      capacity: 2400,
    },
    {
      name: "Wawa T-bar",
      status: "Open",
      type: "Surface Lift",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 3,
      verticalRise: 400,
      capacity: 600,
    },
    {
      name: "Mitey Mite",
      status: "Closed",
      type: "Surface Lift",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 2,
      verticalRise: 200,
      capacity: 400,
    },
    {
      name: "Tiny Tigers",
      status: "Closed",
      type: "Surface Lift",
      groomed: false,
      lastUpdated: new Date().toISOString(),
      rideTime: 2,
      verticalRise: 150,
      capacity: 400,
    },
  ],
  trails: [
    // Green Trails - OPEN
    { name: "Tin Can Alley", status: "Open", difficulty: "Green Circle", groomed: true, lastUpdated: new Date().toISOString() },
    { name: "World Cup Downhill", status: "Open", difficulty: "Green Circle", groomed: true, lastUpdated: new Date().toISOString() },
    { name: "Brewster", status: "Open", difficulty: "Green Circle", groomed: true, lastUpdated: new Date().toISOString() },
    { name: "Jackrabbit", status: "Open", difficulty: "Green Circle", groomed: true, lastUpdated: new Date().toISOString() },
    { name: "Little Chief", status: "Open", difficulty: "Green Circle", groomed: true, lastUpdated: new Date().toISOString() },

    // Blue Trails - OPEN
    { name: "Bye Bye Bowl", status: "Open", difficulty: "Blue Square", groomed: true, lastUpdated: new Date().toISOString() },
    { name: "Sunshine", status: "Open", difficulty: "Blue Square", groomed: true, lastUpdated: new Date().toISOString() },
    { name: "Meadow Park", status: "Open", difficulty: "Blue Square", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Divide Glades", status: "Open", difficulty: "Glades", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Strawberry Park", status: "Open", difficulty: "Blue Square", groomed: true, lastUpdated: new Date().toISOString() },
    { name: "The Great Divide", status: "Open", difficulty: "Blue Square", groomed: true, lastUpdated: new Date().toISOString() },

    // Black Trails - OPEN
    { name: "Delirium Dive", status: "Open", difficulty: "Double Black Diamond", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Wild West", status: "Open", difficulty: "Black Diamond", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Goat's Eye Gully", status: "Open", difficulty: "Black Diamond", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Rock Isle Road", status: "Open", difficulty: "Black Diamond", groomed: true, lastUpdated: new Date().toISOString() },
    { name: "FIS Downhill", status: "Open", difficulty: "Black Diamond", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Lone Pine", status: "Open", difficulty: "Black Diamond", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "North Cornice", status: "Open", difficulty: "Black Diamond", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Wild Acres", status: "Open", difficulty: "Black Diamond", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Paris Basin", status: "Open", difficulty: "Black Diamond", groomed: false, lastUpdated: new Date().toISOString() },

    // CLOSED Trails
    { name: "Little Chief Carpet", status: "Closed", difficulty: "Green Circle", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Discovery Lane", status: "Closed", difficulty: "Green Circle", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Tincan Glade", status: "Closed", difficulty: "Blue Square", groomed: false, lastUpdated: new Date().toISOString() },
    { name: "Wolverine", status: "Closed", difficulty: "Blue Square", groomed: false, lastUpdated: new Date().toISOString() },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: { resortId: string } }
) {
  const { resortId } = params;

  // Only Banff Sunshine is implemented
  if (resortId !== "banff-sunshine") {
    return NextResponse.json({
      success: false,
      error: "Resort status data not available for this resort",
    } as ResortStatusResponse);
  }

  try {
    // In a real implementation, this would scrape or fetch from an API
    // For now, return mock data for Banff Sunshine
    return NextResponse.json({
      success: true,
      data: banffSunshineMockData,
    } as ResortStatusResponse);
  } catch (error) {
    console.error("Error fetching resort status:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch resort status",
    } as ResortStatusResponse);
  }
}
