import { NextResponse } from "next/server";
import { updateRankingScore } from "@/lib/services/serverServices";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const score = Number(body.score);
    if (Number.isNaN(score)) return NextResponse.json({ error: 'invalid score' }, { status: 400 });
    const ok = await updateRankingScore(params.id, score);
    if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
