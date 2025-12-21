import { NextResponse } from "next/server";
import { startScoreProcessing } from "../../lib/services/serverServices";

export async function POST() {
  const res = await startScoreProcessing();
  return NextResponse.json(res);
}
