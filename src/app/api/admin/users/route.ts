import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { User } from "@/lib/types";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    // Only get users that have been approved (is_approved = true)
    const { data, error } = await supabase
      .from("Profiles")
      .select("*")
      .eq("is_approved", true);

    if (error) {
      throw error;
    }

    return NextResponse.json(data as User[]);
  } catch (error) {
    console.error("[api/admin/users]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}
