import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_CRITERIA_BUCKET ??
  process.env.SUPABASE_GENERAL_INFO_BUCKET ??
  "evidence_uploads";

const ROOT_FOLDER = "questionnaire_evidence";
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB safety guard

const sanitizeFilename = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]+/g, "_");

export async function POST(req: Request) {
  try {
    if (!STORAGE_BUCKET) {
      return NextResponse.json(
        { error: "Storage bucket is not configured" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const universityId = formData.get("universityId")?.toString();
    const categorySlug = formData.get("categorySlug")?.toString();
    const questionId = formData.get("questionId")?.toString();

    if (!file || !universityId || !categorySlug || !questionId) {
      return NextResponse.json(
        { error: "Missing upload parameters" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20MB." },
        { status: 413 }
      );
    }

    const supabase = getSupabaseServerClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${sanitizeFilename(
      file.name || "evidence"
    )}`;
    const storagePath = `${ROOT_FOLDER}/${universityId}/${categorySlug}/${questionId}/${fileName}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        upsert: true,
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      console.error("[questionnaire/upload] storage failed", error);
      return NextResponse.json(
        { error: error.message ?? "Failed to upload evidence" },
        { status: 500 }
      );
    }

    return NextResponse.json({ path: storagePath });
  } catch (error) {
    console.error("[questionnaire/upload] unexpected error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while uploading evidence",
      },
      { status: 500 }
    );
  }
}
