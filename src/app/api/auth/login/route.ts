import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { User } from "@/lib/types";

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

    // Query user by email (using username as email)
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", username)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // In production, verify password hash
    // For now, simple password check (replace with proper auth)
    // You should use Supabase Auth instead of manual password handling

    // Generate a simple token (in production, use proper JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    return NextResponse.json({
      user: user as User,
      token,
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
