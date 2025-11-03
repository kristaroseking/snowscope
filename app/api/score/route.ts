import { NextRequest, NextResponse } from "next/server";
import type {
  SkiConditionRatingRequest,
  SkiConditionRatingResponse,
} from "@/types/scoring";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8080";

function getRatingEmoji(rating: string): string {
  const emojiMap: Record<string, string> = {
    BLOWER: "🔥",
    PERFECT: "⭐",
    EXCELLENT: "😃",
    GOOD: "😊",
    FAIR: "😐",
    POOR: "😕",
    BAD: "😞",
    GO_SURFING: "🏄",
  };
  return emojiMap[rating] || "😐";
}

function getConditionsSummary(rating: string): string {
  const summaryMap: Record<string, string> = {
    BLOWER: "Epic powder conditions! Deep, light snow.",
    PERFECT: "Perfect skiing conditions across the board.",
    EXCELLENT: "Excellent conditions with fresh snow.",
    GOOD: "Good skiing conditions.",
    FAIR: "Fair conditions - decent skiing.",
    POOR: "Poor conditions - challenging skiing.",
    BAD: "Bad conditions - not recommended.",
    GO_SURFING: "Go Surfing - Resort closed or insufficient snow.",
  };
  return summaryMap[rating] || "Fair conditions";
}

export async function POST(request: NextRequest) {
  try {
    const body: SkiConditionRatingRequest = await request.json();

    // Call Python Flask API
    const response = await fetch(`${PYTHON_API_URL}/api/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Python API returned ${response.status}`);
    }

    const result: any = await response.json();

    // Map Python API response to expected format
    const mappedResult: SkiConditionRatingResponse = {
      overall_score: result.total_weighted_points || 50,
      rating: result.rating || "FAIR",
      rating_emoji: getRatingEmoji(result.rating),
      component_scores: {
        new_snow: {
          score: result.factor_points?.new_snow || 50,
          weight: result.weighted_factor_points?.new_snow || 0,
          max_possible: 100,
          percentage: result.factor_points?.new_snow || 50,
        },
        snow_depth: {
          score: result.factor_points?.base_depth || 50,
          weight: result.weighted_factor_points?.base_depth || 0,
          max_possible: 100,
          percentage: result.factor_points?.base_depth || 50,
        },
        snow_quality: {
          score: result.factor_points?.quality || 50,
          weight: result.weighted_factor_points?.quality || 0,
          max_possible: 100,
          percentage: result.factor_points?.quality || 50,
        },
        temperature: {
          score: result.factor_points?.temperature || 50,
          weight: result.weighted_factor_points?.temperature || 0,
          max_possible: 100,
          percentage: result.factor_points?.temperature || 50,
        },
        wind: {
          score: result.factor_points?.wind || 50,
          weight: result.weighted_factor_points?.wind || 0,
          max_possible: 100,
          percentage: result.factor_points?.wind || 50,
        },
      },
      details: {
        conditions_summary: getConditionsSummary(result.rating),
        best_for: [],
        considerations: [],
      },
    };

    return NextResponse.json({
      success: true,
      data: mappedResult,
    });
  } catch (error) {
    console.error("Error calling Python scoring API:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to calculate ski condition score",
      },
      { status: 500 }
    );
  }
}
