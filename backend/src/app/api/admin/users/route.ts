import { NextResponse } from "next/server";
import { getUsers } from "@/lib/services/serverServices";

export async function GET() {
  const data = await getUsers();
  return NextResponse.json(data);
}
