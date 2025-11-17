import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { mapDbToUniversity, type DbUniversity } from "@/lib/dbMappers";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .order("rank", { ascending: true });

    if (error) {
      throw error;
    }

    const universities = (data as DbUniversity[]).map(mapDbToUniversity);
    return NextResponse.json(universities);
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
