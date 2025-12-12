import { NextResponse } from "next/server";
import { getUniversities } from "@/lib/services/serverServices";

export async function GET() {
  const data = await getUniversities();
  return NextResponse.json(data);
}
