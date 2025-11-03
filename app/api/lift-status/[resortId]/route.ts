import { NextRequest, NextResponse } from "next/server";
import { scrapeLiftStatus } from "@/lib/services/liftScrapers";

export async function GET(
  request: NextRequest,
  { params }: { params: { resortId: string } }
) {
  const { resortId } = params;

  try {
    const result = await scrapeLiftStatus(resortId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to fetch lift status" },
        { status: result.error?.includes("not supported") ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        lifts: result.lifts || [],
        trails: result.trails || [],
        lastUpdated: result.lastUpdated || new Date().toISOString(),
        resortId: resortId,
      },
    });
  } catch (error) {
    console.error("Error fetching lift status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch lift status",
      },
      { status: 500 }
    );
  }
}
