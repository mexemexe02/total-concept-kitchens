import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { PortalSettings } from "@/lib/mise-types";
import { getPortalSettings, savePortalSettings } from "@/lib/portal-settings";
import { verifyPortalSession } from "@/lib/portal-session";

export const runtime = "nodejs";

function authorized(): boolean {
  const secret = process.env.TCK_PORTAL_SECRET;
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
  const pick = (v: unknown, cur: string | null): string | null => {
    if (v === null) return null;
    if (typeof v === "string") return v.trim() === "" ? null : v;
    return cur;
  };
  const next: PortalSettings = {
    announcementBanner:
      body.announcementBanner !== undefined
        ? pick(body.announcementBanner, current.announcementBanner)
        : current.announcementBanner,
    chatGreeting:
      body.chatGreeting !== undefined
        ? pick(body.chatGreeting, current.chatGreeting)
        : current.chatGreeting,
    chatFooterNote:
      body.chatFooterNote !== undefined
        ? pick(body.chatFooterNote, current.chatFooterNote)
        : current.chatFooterNote,
    updatedAt: current.updatedAt,
  };
  await savePortalSettings(next);
  return NextResponse.json(await getPortalSettings());
}
