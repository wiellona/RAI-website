import { NextResponse } from "next/server";
import { updateUserRole } from "@/lib/services/serverServices";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const role = body.role;
    if (!role) return NextResponse.json({ error: 'missing role' }, { status: 400 });
    const ok = await updateUserRole(params.id, role);
    if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
