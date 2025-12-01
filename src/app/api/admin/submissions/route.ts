import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { Submission } from "@/lib/types";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    // 1. Ambil semua Universities
    const { data: universities, error: universitiesError } = await supabase
      .from("Universities")
      .select("*")
      .order("created_at", { ascending: false });

    if (universitiesError) {
      console.error("[api/admin/submissions] Error fetching universities:", universitiesError);
      throw universitiesError;
    }

    console.log("[api/admin/submissions] Total universities found:", universities?.length || 0);

    if (!universities || universities.length === 0) {
      console.log("[api/admin/submissions] No universities in database");
      return NextResponse.json([]);
    }

    // 2. Ambil semua Profiles dengan is_approved = false
    const { data: profiles, error: profilesError } = await supabase
      .from("Profiles")
      .select("id, name, is_approved")
      .eq("is_approved", false);

    if (profilesError) {
      console.error("[api/admin/submissions] Error fetching profiles:", profilesError);
      throw profilesError;
    }

    console.log("[api/admin/submissions] Profiles with is_approved=false:", profiles?.length || 0);

    if (!profiles || profiles.length === 0) {
      console.log("[api/admin/submissions] No unapproved profiles found");
      return NextResponse.json([]);
    }

    // 3. Ambil email dari auth.users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error("[api/admin/submissions] Error fetching users:", usersError);
    }

    const emailMap = new Map<string, string>();
    (users || []).forEach((user) => {
      if (user.email) {
        emailMap.set(user.id, user.email);
      }
    });

    // 4. Filter universities yang pic_name cocok dengan name di Profiles (is_approved = false)
    const submissionsData = universities
      .map((university) => {
        // Cari profile yang name-nya sama dengan pic_name di university
        const matchingProfile = profiles.find((p) => p.name === university.pic_name);
        
        if (!matchingProfile) {
          return null;
        }

        console.log(`[api/admin/submissions] University "${university.name}" matched with profile "${matchingProfile.name}" (is_approved=${matchingProfile.is_approved})`);

        return {
          id: university.id,
          university_id: university.id,
          questionnaire_id: '', // Not needed for this flow
          submitted_by_user_id: matchingProfile.id,
          submitted_at: university.created_at,
          status: 'pending' as const,
          university: {
            name: university.name,
            website: university.website,
            address: university.address,
            date_of_establishment: university.date_of_establishment,
            dean_name: university.dean_name,
            pic_name: university.pic_name,
            pic_email: university.pic_email,
            country_code: university.country_code,
            pic_relation: university.pic_relation,
            publication_evidence_path: university.publication_evidence_path,
            asset_evidence_path: university.asset_evidence_path,
            letter_path: university.letter_path,
          },
          submittedBy: {
            name: matchingProfile.name,
            email: emailMap.get(matchingProfile.id) || '',
          },
        };
      })
      .filter((item) => item !== null) as Submission[];

    console.log("[api/admin/submissions] Pending submissions (is_approved=false):", submissionsData.length);

    return NextResponse.json(submissionsData);
  } catch (error) {
    console.error("[api/admin/submissions]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch submissions",
      },
      { status: 500 }
    );
  }
}
