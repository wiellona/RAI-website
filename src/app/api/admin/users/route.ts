import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { User } from "@/lib/types";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("users")
      .select("*");

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
