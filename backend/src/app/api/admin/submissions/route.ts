import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/services/serverServices";

export async function GET() {
  const data = await getSubmissions();
  return NextResponse.json(data);
}
