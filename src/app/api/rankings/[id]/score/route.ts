import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { id } = await params;
    const body = await request.json();
    const { score } = body;

    if (typeof score !== "number" || score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Score must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("Universities")
      .update({ trust_score: score })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[api/rankings/score]`, error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update ranking score",
      },
      { status: 500 }
    );
  }
}
