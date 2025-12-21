import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { type DbUniversity } from "@/lib/dbMappers";
import type { University, RAIDimensions } from "@/lib/types";

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

    // 5. Ambil CategoryScores untuk submissions dengan JOIN ke Categories
    const submissionIds = submissions?.map(s => s.id) || [];
    
    const { data: categoryScores, error: scoresError } = await supabase
      .from("CategoryScores")
      .select(`
        submission_id, 
        calculated_score,
        Categories (
          name
        )
      `)
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
      
      // 7a. Jika metrics final sudah disimpan di kolom metrics (JSON), gunakan itu.
      const storedMetrics = (dbUni as any).metrics as Partial<RAIDimensions> | null | undefined;

      const metrics: RAIDimensions = {
        collaboration: null as number | null,
        privacy: null as number | null,
        accountability: null as number | null,
        security: null as number | null,
        ethicsInAI: null as number | null,
        fairness: null as number | null,
        transparency: null as number | null,
        continuousLearning: null as number | null,
      };

      let hasStored = false;
      if (storedMetrics && typeof storedMetrics === "object") {
        (Object.keys(metrics) as (keyof RAIDimensions)[]).forEach((key) => {
          const value = storedMetrics[key];
          if (typeof value === "number") {
            metrics[key] = value;
            hasStored = true;
          }
        });
      }

      // 7b. Jika belum ada metrics final di DB, fallback ke hitung dari CategoryScores
      if (!hasStored && submission && categoryScores) {
        const scores = categoryScores.filter(cs => cs.submission_id === submission.id);
        
        console.log(`[api/rankings] Processing ${scores.length} scores for university "${dbUni.name}"`);
        
        scores.forEach((score) => {
          // @ts-ignore - Categories is joined data
          const categoryName = score.Categories?.name || '';
          const normalizedName = categoryName.toLowerCase().replace(/\s+/g, '');
          const scoreValue = parseFloat(score.calculated_score);
          
          console.log(`[api/rankings] Category: "${categoryName}" (normalized: "${normalizedName}") = ${scoreValue}`);
          
          if (normalizedName === 'collaboration') {
            metrics.collaboration = scoreValue;
          } else if (normalizedName === 'privacy') {
            metrics.privacy = scoreValue;
          } else if (normalizedName === 'accountability') {
            metrics.accountability = scoreValue;
          } else if (normalizedName === 'security') {
            metrics.security = scoreValue;
          } else if (normalizedName.includes('ethics')) {
            metrics.ethicsInAI = scoreValue;
          } else if (normalizedName === 'fairness') {
            metrics.fairness = scoreValue;
          } else if (normalizedName === 'transparency') {
            metrics.transparency = scoreValue;
          } else if (normalizedName.includes('learning') || normalizedName.includes('continous')) {
            metrics.continuousLearning = scoreValue;
          }
        });
        
        console.log(`[api/rankings] Final metrics for "${dbUni.name}":`, metrics);
      }

      return {
        id: dbUni.id,
        slug: dbUni.slug || '',
        name: dbUni.name,
        country: dbUni.country_code || '',
        region: '', 
        rank: ranking?.rank || 0,
        trustScore: ranking?.final_total_score || 0,
        lastUpdated: dbUni.updated_at || dbUni.created_at || new Date().toISOString(),
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
