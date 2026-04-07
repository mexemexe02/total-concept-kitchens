import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { MiseFaqRow } from "@/lib/mise-types";
import { getCustomMiseFaq, saveCustomMiseFaq } from "@/lib/mise-custom-faq";
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
  const rows = await getCustomMiseFaq();
  return NextResponse.json({ entries: rows });
}

export async function POST(req: Request) {
  if (!authorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = body as { entries?: unknown };
  const rawEntries = Array.isArray(o.entries) ? o.entries : [];
  const parsed: MiseFaqRow[] = [];

  for (const item of rawEntries) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const q = typeof r.q === "string" ? r.q.trim() : "";
    const a = typeof r.a === "string" ? r.a.trim() : "";
    if (!q || !a) continue;
    let tags: string[] | undefined;
    if (Array.isArray(r.tags)) {
      tags = r.tags.filter((t): t is string => typeof t === "string").map((t) => t.trim());
    } else if (typeof r.tags === "string" && r.tags.trim()) {
      tags = r.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    parsed.push({
      id: typeof r.id === "number" ? r.id : 0,
      q: q.slice(0, 500),
      a: a.slice(0, 4000),
      ...(tags?.length ? { tags: tags.slice(0, 12) } : {}),
    });
  }

  await saveCustomMiseFaq(parsed);
  const entries = await getCustomMiseFaq();
  return NextResponse.json({ entries, saved: entries.length });
}
