// ⚠️ FEATURE DISABLED - Gemini AI analysis feature commented out for deployment
// Requires: npm install @google/generative-ai

import { NextResponse } from "next/server";
import { analyzeUniversityMetrics, analyzeUniversityRAI } from "@/lib/geminiAI";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  // Feature temporarily disabled
  return NextResponse.json(
    { error: "AI analysis feature is currently unavailable" },
    { status: 503 }
  );

  /* Original code - commented out for deployment
  try {
    const body = await request.json();
    const { universityId, name, trustScore, metrics } = body as {
      universityId?: string;
      name?: string;
      trustScore?: number;
      metrics?: {
        collaboration?: number | null;
        privacy?: number | null;
        accountability?: number | null;
        security?: number | null;
        ethicsInAI?: number | null;
        fairness?: number | null;
        transparency?: number | null;
        continuousLearning?: number | null;
      };
    };

    // If client provides payload, analyze directly using 8-dimension RAI
    if (name && metrics && typeof trustScore === 'number') {
      const analysis = await analyzeUniversityRAI(name, {
        collaboration: metrics.collaboration ?? null,
        privacy: metrics.privacy ?? null,
        accountability: metrics.accountability ?? null,
        security: metrics.security ?? null,
        ethicsInAI: metrics.ethicsInAI ?? null,
        fairness: metrics.fairness ?? null,
        transparency: metrics.transparency ?? null,
        continuousLearning: metrics.continuousLearning ?? null,
      }, trustScore);

      return NextResponse.json({ success: true, universityName: name, analysis });
    }

    if (!universityId) {
      return NextResponse.json(
        { error: "University ID or metrics payload is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // Fetch university data
    const { data: university, error } = await supabase
      .from("Universities")
      .select("name, transparency, auditability, data_privacy, policy_maturity, trust_score")
      .eq("id", universityId)
      .single();

    if (error || !university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Analyze with Gemini AI
    const analysis = await analyzeUniversityMetrics(
      university.name,
      {
        transparency: university.transparency,
        auditability: university.auditability,
        dataPrivacy: university.data_privacy,
        policyMaturity: university.policy_maturity,
      },
      university.trust_score
    );

    return NextResponse.json({
      success: true,
      universityName: university.name,
      analysis,
    });
  } catch (error) {
    console.error("[api/admin/analyze-university]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze university",
      },
      { status: 500 }
    );
  }
  */
}
