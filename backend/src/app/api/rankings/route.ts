import { NextResponse } from "next/server";
import { getRankings } from "@/lib/services/serverServices";

export async function GET() {
  const data = await getRankings();
  return NextResponse.json(data);
}
