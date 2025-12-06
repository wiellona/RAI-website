import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // Create a client-side auth client using ANON key (not service role)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase configuration missing" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Use Supabase Auth signInWithPassword with ANON key
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

    // Create admin client to fetch profile (bypassing RLS)
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get user profile from Profiles table using admin client
    const { data: profile, error: profileError } = await adminClient
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
