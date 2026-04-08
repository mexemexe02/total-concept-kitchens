import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCrmLeads, MAX_LEADS, newCrmLeadId, saveCrmLeads } from "@/lib/crm-leads";
import type { CrmLead, CrmLeadStatus } from "@/lib/crm-types";
import { CRM_LEAD_STATUSES } from "@/lib/crm-types";
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
  const leads = await getCrmLeads();
  // Newest first for the UI
  const sorted = [...leads].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  return NextResponse.json({ leads: sorted });
}

type CreateBody = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  projectNote?: string | null;
  nextStep?: string | null;
  status?: string;
  source?: string | null;
};

export async function POST(req: Request) {
  if (!authorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const leads = await getCrmLeads();
  if (leads.length >= MAX_LEADS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_LEADS} leads — remove some to add more.` },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const status: CrmLeadStatus =
    typeof body.status === "string" && CRM_LEAD_STATUSES.includes(body.status as CrmLeadStatus)
      ? (body.status as CrmLeadStatus)
      : "new";

  const row: CrmLead = {
    id: newCrmLeadId(),
    createdAt: now,
    updatedAt: now,
    name: name.slice(0, 200),
    email: typeof body.email === "string" && body.email.trim() ? body.email.trim().slice(0, 120) : null,
    phone: typeof body.phone === "string" && body.phone.trim() ? body.phone.trim().slice(0, 120) : null,
    projectNote:
      typeof body.projectNote === "string" && body.projectNote.trim()
        ? body.projectNote.trim().slice(0, 2000)
        : null,
    nextStep:
      typeof body.nextStep === "string" && body.nextStep.trim()
        ? body.nextStep.trim().slice(0, 500)
        : null,
    status,
    source:
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 120)
        : null,
  };

  leads.push(row);
  await saveCrmLeads(leads);
  return NextResponse.json({ lead: row });
}

type PatchBody = Partial<CrmLead> & { id: string };

export async function PATCH(req: Request) {
  if (!authorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: PatchBody;
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const leads = await getCrmLeads();
  const i = leads.findIndex((l) => l.id === body.id);
  if (i < 0) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const cur = leads[i]!;
  const next: CrmLead = { ...cur, updatedAt: new Date().toISOString() };

  if (typeof body.name === "string" && body.name.trim()) {
    next.name = body.name.trim().slice(0, 200);
  }
  if (body.email !== undefined) {
    next.email =
      typeof body.email === "string" && body.email.trim()
        ? body.email.trim().slice(0, 120)
        : null;
  }
  if (body.phone !== undefined) {
    next.phone =
      typeof body.phone === "string" && body.phone.trim()
        ? body.phone.trim().slice(0, 120)
        : null;
  }
  if (body.projectNote !== undefined) {
    next.projectNote =
      typeof body.projectNote === "string" && body.projectNote.trim()
        ? body.projectNote.trim().slice(0, 2000)
        : null;
  }
  if (body.nextStep !== undefined) {
    next.nextStep =
      typeof body.nextStep === "string" && body.nextStep.trim()
        ? body.nextStep.trim().slice(0, 500)
        : null;
  }
  if (typeof body.status === "string" && CRM_LEAD_STATUSES.includes(body.status as CrmLeadStatus)) {
    next.status = body.status as CrmLeadStatus;
  }
  if (body.source !== undefined) {
    next.source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 120)
        : null;
  }

  leads[i] = next;
  await saveCrmLeads(leads);
  return NextResponse.json({ lead: next });
}

export async function DELETE(req: Request) {
  if (!authorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id?.trim()) {
    return NextResponse.json({ error: "id query required" }, { status: 400 });
  }
  const leads = await getCrmLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  await saveCrmLeads(filtered);
  return NextResponse.json({ ok: true });
}
