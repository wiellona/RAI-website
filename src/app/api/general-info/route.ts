import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseServerClient } from "@/supabase/supabaseServer";

export const runtime = "nodejs";

const normalizeString = (value: FormDataEntryValue | null): string | null => {
  if (!value) return null;
  if (typeof value === "string") return value.trim() || null;
  return String(value).trim() || null;
};

const normalizeCount = (value: FormDataEntryValue | null): number | null => {
  if (!value || typeof value !== "string") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
    return null;
  }
  return parsed;
};

async function getAuthedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user || !user.email) return null;
  return user;
}

export async function GET() {
  try {
    const user = await getAuthedUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("Universities")
      .select(
        "id,name,address,website,date_of_establishment,dean_name,pic_name,pic_email,publication_count,asset_count"
      )
      .eq("pic_email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[general-info] load failed", error);
      return NextResponse.json(
        { error: "Failed to load data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[general-info] unexpected", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load general info",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthedUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid multipart form" },
        { status: 400 }
      );
    }

    const universityName = normalizeString(form.get("universityName"));
    const dateEstablishment = normalizeString(form.get("dateEstablishment"));
    const websiteAddress = normalizeString(form.get("websiteAddress"));
    const addressLocation = normalizeString(form.get("addressLocation"));
    const deanName = normalizeString(form.get("deanName"));
    const picName = normalizeString(form.get("picName"));
    const emailAddress =
      normalizeString(form.get("emailAddress")) ?? user.email;
    const publicationCount = normalizeCount(form.get("numberOfPublications"));
    const assetCount = normalizeCount(form.get("numberOfAssets"));

    if (
      !universityName ||
      !dateEstablishment ||
      !websiteAddress ||
      !addressLocation ||
      !deanName ||
      !picName ||
      !emailAddress ||
      publicationCount === null ||
      assetCount === null
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 422 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { data: currentUniversity, error: fetchError } = await supabase
      .from("Universities")
      .select("id")
      .eq("pic_email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("[general-info] fetch failed", fetchError);
      return NextResponse.json(
        { error: "Failed to load university" },
        { status: 500 }
      );
    }

    if (!currentUniversity) {
      return NextResponse.json(
        { error: "University record not found" },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from("Universities")
      .update({
        name: universityName,
        date_of_establishment: dateEstablishment,
        website: websiteAddress,
        address: addressLocation,
        dean_name: deanName,
        pic_name: picName,
        pic_email: emailAddress,
        publication_count: publicationCount,
        asset_count: assetCount,
      })
      .eq("id", currentUniversity.id);

    if (updateError) {
      console.error("[general-info] update failed", updateError);
      return NextResponse.json(
        { error: "Failed to save data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[general-info] unexpected submit", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit general info",
      },
      { status: 500 }
    );
  }
}
