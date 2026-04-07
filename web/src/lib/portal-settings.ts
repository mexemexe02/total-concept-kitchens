import fs from "fs/promises";
import path from "path";
import type { PortalSettings } from "@/lib/mise-types";

const FILE = path.join(process.cwd(), "content", "portal-settings.json");

export const PORTAL_DEFAULTS: PortalSettings = {
  announcementBanner: null,
  chatGreeting: null,
  chatFooterNote: null,
  updatedAt: null,
};

function merge(raw: unknown): PortalSettings {
  if (!raw || typeof raw !== "object") return { ...PORTAL_DEFAULTS };
  const o = raw as Record<string, unknown>;
  return {
    announcementBanner:
      typeof o.announcementBanner === "string" ? o.announcementBanner : null,
    chatGreeting: typeof o.chatGreeting === "string" ? o.chatGreeting : null,
    chatFooterNote: typeof o.chatFooterNote === "string" ? o.chatFooterNote : null,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : null,
  };
}

/** Read merged portal settings (safe if file missing). */
export async function getPortalSettings(): Promise<PortalSettings> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return merge(JSON.parse(raw));
  } catch {
    return { ...PORTAL_DEFAULTS };
  }
}

/** Persist settings — caller must verify portal auth first. */
export async function savePortalSettings(data: PortalSettings): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const out: PortalSettings = {
    announcementBanner: data.announcementBanner?.trim() || null,
    chatGreeting: data.chatGreeting?.trim() || null,
    chatFooterNote: data.chatFooterNote?.trim() || null,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(FILE, JSON.stringify(out, null, 2), "utf8");
}
