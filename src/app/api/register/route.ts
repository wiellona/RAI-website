import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { Buffer } from "node:buffer";

export const runtime = "nodejs";

// Storage bucket & folder config (ensure bucket exists in Supabase).
const BUCKET_NAME = "Official Letters from Users";
const FOLDER_PREFIX = "OfficialRequestLetterResponse";
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ALLOWED_MIME = new Set(["application/pdf"]);

// Allowed relation values based on schema CHECK constraint.
const ALLOWED_RELATIONS = new Set([
  "faculty",
  "staff",
  "representative",
  "student",
  "other",
]);

/* Extract trimmed string from multipart form */
function getStr(form: FormData, key: string): string | null {
  const raw = form.get(key);
  return typeof raw === "string" ? raw.trim() : raw ? String(raw) : null;
}

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.-]+/g, "_");
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart form" },
      { status: 400 }
    );
  }

  const universityName = getStr(form, "universityName");
  const directorName = getStr(form, "directorName");
  const address = getStr(form, "address");
  const contactPerson = getStr(form, "contactPerson");
  const contactEmail = getStr(form, "contactEmail");
  const countryCodeRaw = getStr(form, "country_code");
  const picRelationRaw = getStr(form, "pic_relation");
  const supabaseUserId = getStr(form, "supabaseUserId");

  // Validate required fields
  if (!universityName || !contactEmail) {
    return NextResponse.json(
      { error: "universityName & contactEmail required" },
      { status: 422 }
    );
  }
  if (!contactPerson) {
    return NextResponse.json(
      { error: "contactPerson required" },
      { status: 422 }
    );
  }
  if (!isEmail(contactEmail)) {
    return NextResponse.json(
      { error: "Invalid contactEmail format" },
      { status: 422 }
    );
  }
  if (!supabaseUserId) {
    return NextResponse.json(
      { error: "supabaseUserId missing" },
      { status: 422 }
    );
  }

  // Normalize / validate country code (optional field)
  const country_code = countryCodeRaw ? countryCodeRaw.toUpperCase() : null;
  if (country_code && !/^[A-Z]{2}$/.test(country_code)) {
    return NextResponse.json(
      { error: "country_code must be ISO Alpha-2 (e.g., ID, US)" },
      { status: 422 }
    );
  }

  // Validate pic_relation (optional field)
  const pic_relation = picRelationRaw ? picRelationRaw.toLowerCase() : null;
  if (pic_relation && !ALLOWED_RELATIONS.has(pic_relation)) {
    return NextResponse.json(
      { error: "pic_relation value not allowed" },
      { status: 422 }
    );
  }

  // Handle file upload (required per business requirement)
  const file = form.get("officialLetter") as File | null;
  if (!file) {
    return NextResponse.json(
      { error: "officialLetter file is required" },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 1MB)" },
      { status: 413 }
    );
  }
  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type (PDF only)" },
      { status: 415 }
    );
  }

  // Upload file to Storage bucket
  const safeName = sanitizeFilename(file.name);
  const path = `${FOLDER_PREFIX}/${Date.now()}_${safeName}`;
  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return NextResponse.json(
      { error: "Failed to read file buffer" },
      { status: 500 }
    );
  }

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadErr) {
    console.error(uploadErr);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  // Derive public URL (will work if bucket is public; if private, handle signed URL later)
  //   const { data: publicUrlData } = supabase.storage
  //     .from(BUCKET_NAME)
  //     .getPublicUrl(path);

  // Insert university record
  const { data: inserted, error: insertErr } = await supabase
    .from("Universities")
    .insert({
      name: universityName,
      address: address || null,
      dean_name: directorName || null,
      pic_name: contactPerson,
      pic_email: contactEmail,
      letter_path: path,
      country_code,
      pic_relation,
    })
    .select("id")
    .single();

  if (insertErr) {
    console.error(insertErr);
    return NextResponse.json(
      { error: "Database insert failed" },
      { status: 500 }
    );
  }

  const { error: profileUpdateErr } = await supabase
    .from("Profiles")
    .update({ name: contactPerson })
    .eq("id", supabaseUserId);

  if (profileUpdateErr) {
    console.error(profileUpdateErr);
    return NextResponse.json(
      { error: "Profile update failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      universityId: inserted.id,
      letterPath: path,
    },
    { status: 201 }
  );
}
