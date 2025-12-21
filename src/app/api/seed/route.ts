import { NextResponse } from "next/server";

// Seed endpoint no longer needed - data is managed directly in Supabase
export async function POST() {
  return NextResponse.json(
    { error: "Seed endpoint deprecated. Manage data directly in Supabase dashboard." },
    { status: 410 }
  );
}