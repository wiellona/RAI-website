import { NextResponse } from "next/server";
import { login } from "@/lib/services/serverServices";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = body.username || body.email;
    const password = body.password || body.pass;
    if (!username || !password) return NextResponse.json({ error: 'missing credentials' }, { status: 400 });
    const res = await login(username, password);
    if (!res) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
