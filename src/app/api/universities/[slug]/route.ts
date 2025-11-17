import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { mapDbToUniversity, type DbUniversity } from "@/lib/dbMappers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { slug } = await params;

    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "University not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    const university = mapDbToUniversity(data as DbUniversity);
    return NextResponse.json(university);
  } catch (error) {
    console.error(`[api/universities/slug]`, error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch university",
      },
      { status: 500 }
    );
  }
}
