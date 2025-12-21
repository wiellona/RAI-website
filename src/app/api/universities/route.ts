import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { mapDbToUniversity, type DbUniversity } from "@/lib/dbMappers";
import type { RAIDimensions } from "@/lib/types";

function computeTrustScore(metrics: RAIDimensions | null | undefined): number {
  if (!metrics) return 0;
  const values = [
    metrics.ethicsInAI,
    metrics.fairness,
    metrics.transparency,
    metrics.accountability,
    metrics.privacy,
    metrics.security,
    metrics.continuousLearning,
    metrics.collaboration,
  ];

  return values.reduce((sum, value) => {
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("Universities")
      .select("*");

    if (error) {
      throw error;
    }

    const universities = (data as DbUniversity[]).map(mapDbToUniversity);

    // Recompute trustScore and ranking order based on current RAI metrics
    const withScores = universities.map((uni) => {
      const computed = computeTrustScore(uni.metrics as RAIDimensions);
      return {
        ...uni,
        trustScore: computed,
      };
    });

    withScores.sort((a, b) => b.trustScore - a.trustScore);

    const ranked = withScores.map((uni, index) => ({
      ...uni,
      rank: index + 1,
    }));

    return NextResponse.json(ranked);
  } catch (error) {
    console.error("[api/universities]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch universities",
      },
      { status: 500 }
    );
  }
}
