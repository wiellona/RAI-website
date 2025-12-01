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
      // 1. Ambil university berdasarkan ID untuk mendapatkan pic_name
      const { data: university, error: fetchError } = await supabase
        .from("Universities")
        .select("pic_name")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      if (!university?.pic_name) {
        return NextResponse.json({ error: "University pic_name not found" }, { status: 404 });
      }

      // 2. Update is_approved = true di Profiles berdasarkan pic_name
      const { error: profileError } = await supabase
        .from('Profiles')
        .update({ is_approved: true })
        .eq('name', university.pic_name);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      return NextResponse.json({ success: true, message: "University approved successfully" });
    } else if (action === "reject") {
      // 1. Ambil university berdasarkan ID untuk mendapatkan pic_name
      const { data: university, error: fetchError } = await supabase
        .from("Universities")
        .select("pic_name")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      if (!university?.pic_name) {
        return NextResponse.json({ error: "University pic_name not found" }, { status: 404 });
      }

      // 2. Untuk reject, bisa delete university atau tetap set is_approved = false
      // Di sini kita tetap set is_approved = false (tetap tidak disetujui)
      const { error: profileError } = await supabase
        .from('Profiles')
        .update({ is_approved: false })
        .eq('name', university.pic_name);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      return NextResponse.json({ success: true, message: "University rejected" });
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
