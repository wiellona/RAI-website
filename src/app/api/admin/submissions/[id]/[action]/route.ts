import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { id } = await params;
    const url = new URL(request.url);
    const action = url.pathname.split('/').pop();

    if (action === "accept") {
      const { error } = await supabase
        .from("Submissions")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;

      return NextResponse.json({ success: true });
    } else if (action === "reject") {
      const { error } = await supabase
        .from("Submissions")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error(`[api/admin/submissions/action]`, error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update submission",
      },
      { status: 500 }
    );
  }
}
