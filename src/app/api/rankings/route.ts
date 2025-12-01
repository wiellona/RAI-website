import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { mapDbToUniversity, type DbUniversity } from "@/lib/dbMappers";

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

    // 4. Map to frontend format
    const mappedUniversities = (approvedUniversities as DbUniversity[]).map(mapDbToUniversity);
    
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
