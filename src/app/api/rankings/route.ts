import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { type DbUniversity } from "@/lib/dbMappers";
import type { University } from "@/lib/types";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    // 1. Ambil semua Universities
    const { data: universities, error: universitiesError } = await supabase
      .from("Universities")
      .select("*");

    if (universitiesError) {
      throw universitiesError;
    }

    console.log("[api/rankings] Total universities found:", universities?.length || 0);

    if (!universities || universities.length === 0) {
      console.log("[api/rankings] No universities in database");
      return NextResponse.json([]);
    }

    // 2. Ambil semua Profiles dengan is_approved = true
    const { data: profiles, error: profilesError } = await supabase
      .from("Profiles")
      .select("id, name, is_approved")
      .eq("is_approved", true);

    if (profilesError) {
      console.error("[api/rankings] Error fetching profiles:", profilesError);
      throw profilesError;
    }

    console.log("[api/rankings] Profiles with is_approved=true:", profiles?.length || 0);

    if (!profiles || profiles.length === 0) {
      console.log("[api/rankings] No approved profiles found");
      return NextResponse.json([]);
    }

    // 3. Filter universities yang pic_name cocok dengan name di Profiles (is_approved = true)
    const approvedUniversities = universities
      .filter((university) => {
        const matchingProfile = profiles.find((p) => p.name === university.pic_name);
        if (matchingProfile) {
          console.log(`[api/rankings] University "${university.name}" matched with approved profile "${matchingProfile.name}"`);
          return true;
        }
        return false;
      });

    console.log("[api/rankings] Approved universities count:", approvedUniversities.length);

    // 4. Ambil Submissions untuk universities yang approved
    const universityIds = approvedUniversities.map(u => u.id);
    
    const { data: submissions, error: submissionsError } = await supabase
      .from("Submissions")
      .select("id, university_id")
      .in("university_id", universityIds);

    if (submissionsError) {
      console.error("[api/rankings] Error fetching submissions:", submissionsError);
    }

    console.log("[api/rankings] Submissions found:", submissions?.length || 0);

    // 5. Ambil CategoryScores untuk submissions
    const submissionIds = submissions?.map(s => s.id) || [];
    
    const { data: categoryScores, error: scoresError } = await supabase
      .from("CategoryScores")
      .select("submission_id, category_name, calculated_score, updated_at")
      .in("submission_id", submissionIds);

    if (scoresError) {
      console.error("[api/rankings] Error fetching category scores:", scoresError);
    }

    console.log("[api/rankings] CategoryScores found:", categoryScores?.length || 0);

    // 6. Ambil UniversityRankings
    const { data: rankings, error: rankingsError } = await supabase
      .from("UniversityRankings")
      .select("*")
      .in("university_id", universityIds);

    if (rankingsError) {
      console.error("[api/rankings] Error fetching rankings:", rankingsError);
    }

    // 7. Map to frontend format dengan scores dari CategoryScores
    const mappedUniversities: University[] = approvedUniversities.map((university) => {
      const dbUni = university as DbUniversity;
      
      // Find submission for this university
      const submission = submissions?.find(s => s.university_id === dbUni.id);
      
      // Find ranking for this university
      const ranking = rankings?.find(r => r.university_id === dbUni.id);
      
      // Build metrics from CategoryScores
      const metrics = {
        collaboration: null as number | null,
        privacy: null as number | null,
        accountability: null as number | null,
        security: null as number | null,
        ethicsInAI: null as number | null,
        fairness: null as number | null,
        transparency: null as number | null,
        continuousLearning: null as number | null,
      };

      if (submission && categoryScores) {
        const scores = categoryScores.filter(cs => cs.submission_id === submission.id);
        
        scores.forEach((score) => {
          const categoryName = score.category_name.toLowerCase().replace(/\s+/g, '');
          
          if (categoryName === 'collaboration') {
            metrics.collaboration = score.calculated_score;
          } else if (categoryName === 'privacy') {
            metrics.privacy = score.calculated_score;
          } else if (categoryName === 'accountability') {
            metrics.accountability = score.calculated_score;
          } else if (categoryName === 'security') {
            metrics.security = score.calculated_score;
          } else if (categoryName.includes('ethics')) {
            metrics.ethicsInAI = score.calculated_score;
          } else if (categoryName === 'fairness') {
            metrics.fairness = score.calculated_score;
          } else if (categoryName === 'transparency') {
            metrics.transparency = score.calculated_score;
          } else if (categoryName.includes('learning')) {
            metrics.continuousLearning = score.calculated_score;
          }
        });
      }

      // Get latest updated_at from category scores
      const latestScoreUpdate = categoryScores
        ?.filter(cs => submission && cs.submission_id === submission.id)
        .map(cs => cs.updated_at)
        .sort()
        .reverse()[0];

      return {
        id: dbUni.id,
        slug: dbUni.slug || '',
        name: dbUni.name,
        country: dbUni.country_code || '',
        region: '', 
        rank: ranking?.rank || 0,
        trustScore: ranking?.final_total_score || 0,
        lastUpdated: latestScoreUpdate || dbUni.updated_at || dbUni.created_at || new Date().toISOString(),
        metrics,
      };
    });

    // Sort by rank
    mappedUniversities.sort((a, b) => a.rank - b.rank);
    
    return NextResponse.json(mappedUniversities);
  } catch (error) {
    console.error("[api/rankings]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch rankings",
      },
      { status: 500 }
    );
  }
}
