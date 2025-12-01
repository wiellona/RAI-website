import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST() {
  try {
    const supabase = getSupabaseServerClient();

    // Get all universities with their metrics
    const { data: universities, error } = await supabase
      .from("Universities")
      .select("id, transparency, auditability, data_privacy, policy_maturity");

    if (error) throw error;

    // Recalculate trust scores based on metrics
    const updates = universities.map((uni: { id: string; transparency: number; auditability: number; data_privacy: number; policy_maturity: number }) => {
      const trustScore = Math.round(
        (uni.transparency +
          uni.auditability +
          uni.data_privacy +
          uni.policy_maturity) /
          4
      );

      return supabase
        .from("Universities")
        .update({ trust_score: trustScore })
        .eq("id", uni.id);
    });

    await Promise.all(updates);

    // Recalculate ranks based on new trust scores
    const { data: rankedUniversities, error: rankError } = await supabase
      .from("Universities")
      .select("id, trust_score")
      .order("trust_score", { ascending: false });

    if (rankError) throw rankError;

    const rankUpdates = rankedUniversities.map((uni: { id: string; trust_score: number }, index: number) => {
      return supabase
        .from("Universities")
        .update({ rank: index + 1 })
        .eq("id", uni.id);
    });

    await Promise.all(rankUpdates);

    return NextResponse.json({
      success: true,
      message: "Score processing completed successfully.",
    });
  } catch (error) {
    console.error("[api/admin/process-scores]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process scores",
      },
      { status: 500 }
    );
  }
}
