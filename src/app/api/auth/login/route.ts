import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Use Supabase Auth signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username, // assuming username is email
      password: password,
    });

    if (error || !data.user) {
      console.error("[api/auth/login] Auth error:", error?.message);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Get user profile from Profiles table
    const { data: profile, error: profileError } = await supabase
      .from("Profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("[api/auth/login] Profile error:", profileError.message);
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.email?.split('@')[0],
        role: profile?.role || 'user',
        is_approved: profile?.is_approved || false,
      },
      session: data.session,
    });
  } catch (error) {
    console.error("[api/auth/login]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 500 }
    );
  }
}
