import fs from "fs/promises";
import path from "path";
import type { MiseFaqRow } from "@/lib/mise-types";

const FILE = path.join(process.cwd(), "content", "mise-custom-faq.json");

function isRow(o: unknown): o is MiseFaqRow {
  if (!o || typeof o !== "object") return false;
  const r = o as Record<string, unknown>;
  return (
    typeof r.id === "number" &&
    Number.isFinite(r.id) &&
    typeof r.q === "string" &&
    typeof r.a === "string"
  );
}

/** Parse file contents into FAQ rows; invalid entries dropped. */
export function parseCustomFaqJson(raw: unknown): MiseFaqRow[] {
  if (!Array.isArray(raw)) return [];
  const out: MiseFaqRow[] = [];
  for (const item of raw) {
    if (!isRow(item)) continue;
    const tags =
      Array.isArray(item.tags) && item.tags.every((t) => typeof t === "string")
        ? item.tags
        : undefined;
    out.push({
      id: item.id,
      q: item.q.trim(),
      a: item.a.trim(),
      ...(tags?.length ? { tags } : {}),
    });
  }
  return out.filter((r) => r.q.length > 0 && r.a.length > 0);
}

export async function getCustomMiseFaq(): Promise<MiseFaqRow[]> {
  try {
    const raw = JSON.parse(await fs.readFile(FILE, "utf8")) as unknown;
    return parseCustomFaqJson(raw);
  } catch {
    return [];
  }
}

/**
 * Persist custom Q&A. Assigns stable negative ids (-1, -2, …) so they never collide
 * with generated `mise-faq.json` positive ids.
 */
export async function saveCustomMiseFaq(rows: MiseFaqRow[]): Promise<void> {
  const cleaned = rows
    .map((r) => ({
      q: r.q.trim(),
      a: r.a.trim(),
      tags: r.tags?.map((t) => t.trim()).filter(Boolean),
    }))
    .filter((r) => r.q.length > 0 && r.a.length > 0);

  const withIds: MiseFaqRow[] = cleaned.map((r, i) => ({
    id: -(i + 1),
    q: r.q.slice(0, 500),
    a: r.a.slice(0, 4000),
    ...(r.tags?.length ? { tags: r.tags.slice(0, 12) } : {}),
  }));

  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(withIds, null, 2), "utf8");
}
