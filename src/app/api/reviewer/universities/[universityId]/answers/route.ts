import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

interface AnswerData {
  id: string;
  evidence_notes: string | null;
  Questions: {
    id: string;
    text: string;
    Categories: {
      name: string;
    } | null;
  } | null;
  Options: {
    text: string;
    value: number;
  } | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ universityId: string }> }
) {
  const { universityId } = await params;
  try {
    const supabase = getSupabaseServerClient();

    // Get all answers for this university
    const { data: submissions } = await supabase
      .from("Submissions")
      .select("id")
      .eq("university_id", universityId)
      .eq("status", "approved");

    if (!submissions || submissions.length === 0) {
      return NextResponse.json([]);
    }

    const submissionIds = submissions.map((s: { id: string }) => s.id);

    // Get answers with joined data
    const { data: answers, error } = await supabase
      .from("Answers")
      .select(
        `
        id,
        evidence_notes,
        Questions (
          id,
          text,
          Categories (
            name
          )
        ),
        Options (
          text,
          value
        )
      `
      )
      .in("submission_id", submissionIds);

    if (error) {
      console.error("Error fetching answers:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format data for CSV export
    const formattedData =
      (answers as unknown as AnswerData[])?.map((answer) => ({
        category: answer.Questions?.Categories?.name || "N/A",
        question: answer.Questions?.text || "N/A",
        selected_option: answer.Options?.text || "N/A",
        option_value: answer.Options?.value || 0,
        evidence: answer.evidence_notes || "No evidence provided",
      })) || [];

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error in answers export:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
