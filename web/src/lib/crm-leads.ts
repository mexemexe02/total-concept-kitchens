import fs from "fs/promises";
import path from "path";
import type { CrmLead, CrmLeadStatus } from "@/lib/crm-types";
import { CRM_LEAD_STATUSES } from "@/lib/crm-types";

const FILE = path.join(process.cwd(), "content", "crm-leads.json");
const MAX_LEADS = 500;

function isStatus(s: unknown): s is CrmLeadStatus {
  return typeof s === "string" && CRM_LEAD_STATUSES.includes(s as CrmLeadStatus);
}

function strOrNull(v: unknown, max: number): string | null {
  if (v == null) return null;
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  return t.length > max ? t.slice(0, max) : t;
}

/** Parse JSON file contents; drops invalid rows. */
export function parseCrmLeadsJson(raw: unknown): CrmLead[] {
  if (!Array.isArray(raw)) return [];
  const out: CrmLead[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    if (typeof o.id !== "string" || !o.id.trim()) continue;
    if (typeof o.name !== "string" || !o.name.trim()) continue;
    if (typeof o.createdAt !== "string" || typeof o.updatedAt !== "string") continue;
    const status: CrmLeadStatus = isStatus(o.status) ? o.status : "new";
    out.push({
      id: o.id.trim().slice(0, 80),
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      name: o.name.trim().slice(0, 200),
      email: strOrNull(o.email, 120),
      phone: strOrNull(o.phone, 120),
      projectNote: strOrNull(o.projectNote, 2000),
      nextStep: strOrNull(o.nextStep, 500),
      status,
      source: strOrNull(o.source, 120),
    });
  }
  return out;
}

export async function getCrmLeads(): Promise<CrmLead[]> {
  try {
    const raw = JSON.parse(await fs.readFile(FILE, "utf8")) as unknown;
    return parseCrmLeadsJson(raw);
  } catch {
    return [];
  }
}

export function newCrmLeadId(): string {
  return `crm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function saveCrmLeads(leads: CrmLead[]): Promise<void> {
  if (leads.length > MAX_LEADS) {
    throw new Error(`Maximum ${MAX_LEADS} leads`);
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(leads, null, 2), "utf8");
}

export { MAX_LEADS };
