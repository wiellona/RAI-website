import { NextResponse } from "next/server";
import { getUniversityBySlug } from "@/lib/services/serverServices";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const uni = await getUniversityBySlug(params.slug);
  if (!uni) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(uni);
}
