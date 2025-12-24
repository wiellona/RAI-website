import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseServerClient } from "@/supabase/supabaseServer";

function decodeSupabaseCookie(value?: string | null) {
  if (!value) return value || undefined;
  if (!value.startsWith("base64-")) return value;

  const payload = value.slice("base64-".length);
  try {
    if (typeof atob === "function") {
      return atob(payload);
    }
    const nodeBuffer = (globalThis as Record<string, unknown>).Buffer as
      | undefined
      | {
          from: (
            input: string,
            encoding: string
          ) => { toString: (encoding: string) => string };
        };
    if (nodeBuffer) {
      return nodeBuffer.from(payload, "base64").toString("utf-8");
    }
  } catch (err) {
    console.error("Failed to decode Supabase cookie", err);
  }
  return value;
}

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase URL or anon key env vars");
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        const raw = req.cookies.get(name)?.value;
        return decodeSupabaseCookie(raw);
      },
      set(name: string, value: string, options?: CookieOptions) {
        res.cookies.set({
          name,
          value,
          path: options?.path ?? "/",
          httpOnly: options?.httpOnly ?? true,
          secure: options?.secure ?? true,
          sameSite: options?.sameSite ?? "lax",
          maxAge: options?.maxAge,
        });
      },
      remove(name: string, options?: CookieOptions) {
        res.cookies.set({
          name,
          value: "",
          path: options?.path ?? "/",
          httpOnly: options?.httpOnly ?? true,
          secure: options?.secure ?? true,
          sameSite: options?.sameSite ?? "lax",
          maxAge: 0,
        });
      },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const protectedBases = ["/questionnaire", "/admin", "/dashboard"];
  const needsAuth = protectedBases.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );

  if (!user && needsAuth) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && needsAuth) {
    const adminSupabase = getSupabaseServerClient();
    const { data: profile, error } = await adminSupabase
      .from("Profiles")
      .select("is_approved,role")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Profiles lookup failed", error);
      return res;
    }

    const requiresApproval =
      profile?.role !== "admin" && !profile?.is_approved;

    if (requiresApproval) {
      return NextResponse.redirect(new URL("/pending-approval", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/questionnaire/:path*", "/admin/:path*", "/dashboard/:path*"],
};
