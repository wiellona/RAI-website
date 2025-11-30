import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { Submission } from "@/lib/types";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    // Join Submissions with Universities to get university details
    const { data, error } = await supabase
      .from("Submissions")
      .select(`
        id,
        university_id,
        questionnaire_id,
        submitted_by_user_id,
        submitted_at,
        status,
        Universities (
          name,
          website,
          address,
          date_of_establishment,
          dean_name,
          pic_name,
          pic_email
        ),
        Questionnaires (
          title,
          version,
          description
        )
      `)
      .eq("status", "submitted")
      .order("submitted_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Map the data to match frontend Submission type
    const submissions: Submission[] = (data || []).map((row: any) => ({
      id: row.id,
      university_id: row.university_id,
      questionnaire_id: row.questionnaire_id,
      submitted_by_user_id: row.submitted_by_user_id,
      submitted_at: row.submitted_at,
      status: row.status,
      university: row.Universities ? {
        name: row.Universities.name,
        website: row.Universities.website,
        address: row.Universities.address,
        date_of_establishment: row.Universities.date_of_establishment,
        dean_name: row.Universities.dean_name,
        pic_name: row.Universities.pic_name,
        pic_email: row.Universities.pic_email,
      } : undefined,
      questionnaire: row.Questionnaires ? {
        title: row.Questionnaires.title,
        version: row.Questionnaires.version?.toString() || '1',
        description: row.Questionnaires.description,
      } : undefined,
    }));

    return NextResponse.json(submissions);
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
