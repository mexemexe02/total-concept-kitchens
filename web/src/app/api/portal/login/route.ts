import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signPortalSession } from "@/lib/portal-session";

export const runtime = "nodejs";

const COOKIE = "tck_portal_sess";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
  const secret = process.env.TCK_PORTAL_SECRET;
  const expected = process.env.TCK_PORTAL_PASSWORD;
  if (!secret || !expected) {
    return NextResponse.json(
      { error: "Portal not configured. Set TCK_PORTAL_SECRET and TCK_PORTAL_PASSWORD." },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = signPortalSession(Date.now() + MAX_AGE_SEC * 1000, secret);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });

  return NextResponse.json({ ok: true });
}
