import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { PortalSettings } from "@/lib/mise-types";
import { PORTAL_MUTABLE_KEYS } from "@/lib/portal-mutable-keys";
import { getPortalSettings, savePortalSettings } from "@/lib/portal-settings";
import { verifyPortalSession } from "@/lib/portal-session";

export const runtime = "nodejs";

function authorized(): boolean {
  const secret = process.env.TCK_PORTAL_SECRET?.trim() ?? "";
  const token = cookies().get("tck_portal_sess")?.value;
  return Boolean(secret && verifyPortalSession(token, secret));
}

export async function GET() {
  if (!authorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getPortalSettings();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  if (!authorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Partial<PortalSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const current = await getPortalSettings();
  const pick = (
    v: unknown,
    cur: PortalSettings[keyof PortalSettings],
  ): PortalSettings[keyof PortalSettings] => {
    if (typeof cur === "boolean") {
      return typeof v === "boolean" ? v : cur;
    }
    if (v === null) return null;
    if (typeof v === "string") return v.trim() === "" ? null : v;
    return cur;
  };
  const next: PortalSettings = { ...current };
  const mutableNext = next as unknown as Record<string, unknown>;
  for (const key of PORTAL_MUTABLE_KEYS) {
    if (body[key] !== undefined) {
      mutableNext[key] = pick(body[key], current[key]);
    }
  }
  await savePortalSettings(next);
  return NextResponse.json(await getPortalSettings());
}
