import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { Submission } from "@/lib/types";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("status", "pending");

    if (error) {
      throw error;
    }

    return NextResponse.json(data as Submission[]);
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
