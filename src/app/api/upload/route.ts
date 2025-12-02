import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import { getSupabaseServerClient } from "@/supabase/supabaseServer";

export const runtime = "nodejs";

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_CRITERIA_BUCKET ??
  process.env.SUPABASE_GENERAL_INFO_BUCKET ??
  "evidence_uploads";
const ROOT_FOLDER = "questionnaire_evidence";
const MAX_FILE_SIZE = 20 * 1024 * 1024;

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

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const submissionId = form.get("submissionId")?.toString();
    const questionId = form.get("questionId")?.toString();
    const universityId = form.get("universityId")?.toString();
    const categorySlug = form.get("categorySlug")?.toString();
    const previousPath = form.get("previousPath")?.toString();

    if (
      !file ||
      !submissionId ||
      !questionId ||
      !universityId ||
      !categorySlug
    ) {
      return NextResponse.json(
        { error: "Missing upload parameters" },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    const supabase = getSupabaseServerClient();

    if (previousPath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([previousPath]);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`;
    const storagePath = `${ROOT_FOLDER}/${universityId}/${categorySlug}/${questionId}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    await supabase.from("Answers").upsert(
      {
        submission_id: submissionId,
        question_id: questionId,
        evidence_notes: storagePath,
      },
      { onConflict: "submission_id,question_id" }
    );

    return NextResponse.json({ path: storagePath });
  } catch (error) {
    console.error("[criteria-evidence] upload failed", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!STORAGE_BUCKET) {
      return NextResponse.json(
        { error: "Storage bucket is not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get("submissionId");
    const questionId = searchParams.get("questionId");
    const path = searchParams.get("path");

    if (!submissionId || !questionId || !path) {
      return NextResponse.json(
        { error: "submissionId, questionId, and path are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);
    if (storageError) {
      console.error("[criteria-evidence] delete storage failed", storageError);
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }

    const { error: dbError } = await supabase
      .from("Answers")
      .update({ evidence_notes: null })
      .eq("submission_id", submissionId)
      .eq("question_id", questionId);

    if (dbError) {
      console.error("[criteria-evidence] clear answer failed", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[criteria-evidence] delete failed", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
