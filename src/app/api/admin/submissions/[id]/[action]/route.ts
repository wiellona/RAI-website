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
    const action = url.pathname.split("/").pop();

    if (action === "accept") {
      console.log(
        `[api/admin/submissions/accept] Accepting university with ID: ${id}`
      );

      // Update is_approved = true di Profiles berdasarkan university_id
      const { data: updatedProfiles, error: profileError } = await supabase
        .from("Profiles")
        .update({ is_approved: true, is_rejected: false })
        .eq("university_id", id)
        .select();

      if (profileError) {
        console.error(
          "[api/admin/submissions/accept] Error updating profile:",
          profileError
        );
        throw profileError;
      }

      console.log(
        "[api/admin/submissions/accept] Profiles updated:",
        updatedProfiles
      );

      if (!updatedProfiles || updatedProfiles.length === 0) {
        console.warn(
          "[api/admin/submissions/accept] No profiles found with university_id:",
          id
        );
        return NextResponse.json(
          {
            error: "No profile found for this university",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "University approved successfully",
        profilesUpdated: updatedProfiles.length,
      });
    } else if (action === "reject") {
      console.log(
        `[api/admin/submissions/reject] Rejecting university with ID: ${id}`
      );

      // 1. Update is_rejected = true di Profiles berdasarkan university_id
      // Lebih reliable daripada matching pic_name
      const { data: updatedProfiles, error: profileError } = await supabase
        .from("Profiles")
        .update({ is_rejected: true })
        .eq("university_id", id)
        .select();

      if (profileError) {
        console.error(
          "[api/admin/submissions/reject] Error updating profile:",
          profileError
        );
        throw profileError;
      }

      console.log(
        "[api/admin/submissions/reject] Profiles updated:",
        updatedProfiles
      );

      if (!updatedProfiles || updatedProfiles.length === 0) {
        console.warn(
          "[api/admin/submissions/reject] No profiles found with university_id:",
          id
        );
        return NextResponse.json(
          {
            error: "No profile found for this university",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "University rejected",
        profilesUpdated: updatedProfiles.length,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
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
