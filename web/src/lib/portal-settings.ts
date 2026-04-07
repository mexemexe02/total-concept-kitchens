import fs from "fs/promises";
import path from "path";
import type { PortalSettings } from "@/lib/mise-types";
import { EMPTY_PORTAL_SETTINGS } from "@/lib/portal-defaults";

const FILE = path.join(process.cwd(), "content", "portal-settings.json");

export const PORTAL_DEFAULTS: PortalSettings = { ...EMPTY_PORTAL_SETTINGS };

function strOrNull(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function merge(raw: unknown): PortalSettings {
  if (!raw || typeof raw !== "object") return { ...EMPTY_PORTAL_SETTINGS };
  const o = raw as Record<string, unknown>;
  return {
    announcementBanner: strOrNull(o.announcementBanner),
    chatGreeting: strOrNull(o.chatGreeting),
    chatFooterNote: strOrNull(o.chatFooterNote),
    updatedAt: strOrNull(o.updatedAt),
    heroEyebrow: strOrNull(o.heroEyebrow),
    heroHeadline: strOrNull(o.heroHeadline),
    heroSupporting: strOrNull(o.heroSupporting),
    heroTrustLine: strOrNull(o.heroTrustLine),
    businessHoursLine: strOrNull(o.businessHoursLine),
    reviewPageUrl: strOrNull(o.reviewPageUrl),
    contactPageIntro: strOrNull(o.contactPageIntro),
    contactExtraNote: strOrNull(o.contactExtraNote),
    footerTagline: strOrNull(o.footerTagline),
    ownerPrivateNotes: strOrNull(o.ownerPrivateNotes),
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

function trimNull(s: string | null | undefined): string | null {
  if (s == null) return null;
  const t = s.trim();
  return t === "" ? null : t;
}

/** Persist settings — caller must verify portal auth first. */
export async function savePortalSettings(data: PortalSettings): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const out: PortalSettings = {
    announcementBanner: trimNull(data.announcementBanner),
    chatGreeting: trimNull(data.chatGreeting),
    chatFooterNote: trimNull(data.chatFooterNote),
    updatedAt: new Date().toISOString(),
    heroEyebrow: trimNull(data.heroEyebrow),
    heroHeadline: trimNull(data.heroHeadline),
    heroSupporting: trimNull(data.heroSupporting),
    heroTrustLine: trimNull(data.heroTrustLine),
    businessHoursLine: trimNull(data.businessHoursLine),
    reviewPageUrl: trimNull(data.reviewPageUrl),
    contactPageIntro: trimNull(data.contactPageIntro),
    contactExtraNote: trimNull(data.contactExtraNote),
    footerTagline: trimNull(data.footerTagline),
    ownerPrivateNotes: trimNull(data.ownerPrivateNotes),
  };
  await fs.writeFile(FILE, JSON.stringify(out, null, 2), "utf8");
}
