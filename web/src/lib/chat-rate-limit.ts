/**
 * Simple sliding-window rate limiter for POST /api/chat (per client IP / key).
 *
 * In-memory only — effective for a **single Node process** (typical standalone
 * Docker/Coolify). With **multiple replicas**, each instance has its own counter;
 * use a reverse-proxy limit or Redis if you need a global cap.
 */

const buckets = new Map<string, number[]>();

/** Test helper: clears all buckets between Vitest cases. */
export function resetChatRateLimitForTests(): void {
  buckets.clear();
}

function maxRequests(): number {
  const n = parseInt(process.env.CHAT_RATE_LIMIT_MAX ?? "30", 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 500) : 30;
}

function windowMs(): number {
  const n = parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS ?? "60000", 10);
  return Number.isFinite(n) && n >= 5000 ? Math.min(n, 3_600_000) : 60_000;
}

/**
 * Prefer the first IP from X-Forwarded-For (proxy chain), then X-Real-IP.
 * Falls back to "unknown" so abuse still hits a shared bucket (better than no limit).
 */
export function getChatClientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

export type ChatRateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

/**
 * Returns whether another request is allowed; if not, suggests Retry-After seconds.
 */
export function takeChatRateToken(clientKey: string): ChatRateLimitResult {
  if (process.env.CHAT_RATE_LIMIT_DISABLED === "true") {
    return { ok: true };
  }

  const max = maxRequests();
  const win = windowMs();
  const now = Date.now();

  const prev = buckets.get(clientKey) ?? [];
  const recent = prev.filter((t) => now - t < win);

  if (recent.length >= max) {
    const oldest = recent[0]!;
    const retryAfterMs = oldest + win - now;
    const retryAfterSec = Math.max(1, Math.ceil(retryAfterMs / 1000));
    return { ok: false, retryAfterSec };
  }

  recent.push(now);
  buckets.set(clientKey, recent);

  // Cap map size so a flood of unique keys cannot grow memory without bound.
  if (buckets.size > 8000) {
    const drop = Math.floor(buckets.size / 4);
    const keys = Array.from(buckets.keys());
    for (let i = 0; i < drop && i < keys.length; i++) {
      buckets.delete(keys[i]!);
    }
  }

  return { ok: true };
}
