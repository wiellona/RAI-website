import { NextResponse } from "next/server";
import { acceptSubmission } from "@/lib/services/serverServices";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const ok = await acceptSubmission(params.id);
  if (!ok) return NextResponse.json({ success: false, error: 'not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
