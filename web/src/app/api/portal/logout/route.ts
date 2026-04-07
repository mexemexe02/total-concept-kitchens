import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().delete("tck_portal_sess");
  return NextResponse.json({ ok: true });
}
