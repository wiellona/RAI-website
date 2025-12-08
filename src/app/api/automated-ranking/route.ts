import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseServerClient } from "@/supabase/supabaseServer";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface UniversityData {
  id: string;
  university_name: string;
  university_name_normalized: string;
  analysis_timestamp: string;
  duration_seconds: number;
  status: string;
  step_publications_completed: boolean;
  step_huggingface_completed: boolean;
  step_github_completed: boolean;
  step_policies_completed: boolean;
  step_organigram_completed: boolean;
  total_publications: number;
  total_models: number;
  total_datasets: number;
  total_policies: number;
  total_divisions: number;
  total_assets: number;
  storage_folder_path?: string;
  publications_csv_url?: string;
  huggingface_csv_url?: string;
  github_csv_url?: string;
  policies_csv_url?: string;
  organigram_csv_url?: string;
  created_at: string;
  updated_at: string;
}

interface RankedUniversity extends UniversityData {
  publications_grade: number;
  assets_grade: number;
  policies_grade: number;
  divisions_grade: number;
  total_score: number;
  rank: number;
}

/**
 * Calculate score based on percentile ranking
 * Scale: 0.000 - 2.500 for each column
 * Total possible score: 10.000 (4 columns × 2.500)
 */
function calculateScore(value: number, sortedValues: number[]): number {
  const n = sortedValues.length;
  if (n === 0) return 0;
  if (n === 1) return 2.5; // Single entry gets top score

  // Find the position of this value in the sorted array
  const position = sortedValues.indexOf(value);
  const percentile = (position / (n - 1)) * 100;

  // Linear scale from 0.000 to 2.500 based on percentile
  // 0th percentile (worst) = 0.000
  // 100th percentile (best) = 2.500
  return (percentile / 100) * 2.5;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseBrowserClient();

    // Fetch all completed crawling data
    const { data, error } = await supabase
      .from("university_crawling")
      .select("*");

    if (error) {
      console.error("Error fetching automated ranking data:", error);
      return NextResponse.json(
        { error: "Failed to fetch automated ranking data" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Format the data and calculate total assets
    const formattedData: UniversityData[] = data.map((item) => {
      const total_models =
        (item.total_huggingface_models || 0) + (item.total_github_models || 0);
      const total_datasets =
        (item.total_huggingface_datasets || 0) +
        (item.total_github_datasets || 0);
      const total_assets = total_models + total_datasets;
      return {
        id: item.id,
        university_name: item.university_name,
        university_name_normalized: item.university_name_normalized,
        analysis_timestamp: item.analysis_timestamp,
        duration_seconds: item.duration_seconds,
        status: item.status,

        // Step completion flags
        step_publications_completed: item.step_publications_completed,
        step_huggingface_completed: item.step_huggingface_completed,
        step_github_completed: item.step_github_completed,
        step_policies_completed: item.step_policies_completed,
        step_organigram_completed: item.step_organigram_completed,

        // Summary counts
        total_publications: item.total_publications || 0,
        total_models,
        total_datasets,
        total_policies: item.total_policies || 0,
        total_divisions: item.total_divisions || 0,
        total_assets,

        // Storage and CSV URLs
        storage_folder_path: item.storage_folder_path,
        publications_csv_url: item.publications_csv_url,
        huggingface_csv_url: item.huggingface_csv_url,
        github_csv_url: item.github_csv_url,
        policies_csv_url: item.policies_csv_url,
        organigram_csv_url: item.organigram_csv_url,

        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });

    // Extract values for each metric and sort them (ascending order)
    const publicationsValues = formattedData
      .map((d) => d.total_publications)
      .sort((a, b) => a - b);

    const assetsValues = formattedData
      .map((d) => d.total_assets)
      .sort((a, b) => a - b);

    const policiesValues = formattedData
      .map((d) => d.total_policies)
      .sort((a, b) => a - b);

    const divisionsValues = formattedData
      .map((d) => d.total_divisions)
      .sort((a, b) => a - b);

    // Calculate scores for each university (0-2.500 per column, total 0-10.000)
    const rankedData: RankedUniversity[] = formattedData.map((uni) => {
      const publications_grade = calculateScore(
        uni.total_publications,
        publicationsValues
      );
      const assets_grade = calculateScore(uni.total_assets, assetsValues);
      const policies_grade = calculateScore(uni.total_policies, policiesValues);
      const divisions_grade = calculateScore(
        uni.total_divisions,
        divisionsValues
      );

      const total_score =
        publications_grade + assets_grade + policies_grade + divisions_grade;

      return {
        ...uni,
        publications_grade,
        assets_grade,
        policies_grade,
        divisions_grade,
        total_score,
        rank: 0, // Will be assigned after sorting
      };
    });

    // Sort by total score (descending) and assign ranks
    rankedData.sort((a, b) => b.total_score - a.total_score);
    rankedData.forEach((uni, index) => {
      uni.rank = index + 1;
    });

    return NextResponse.json({ data: rankedData }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in automated-ranking API:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
