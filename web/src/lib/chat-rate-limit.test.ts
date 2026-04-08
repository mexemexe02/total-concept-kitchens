import { afterEach, describe, expect, it } from "vitest";
import {
  getChatClientKey,
  resetChatRateLimitForTests,
  takeChatRateToken,
} from "@/lib/chat-rate-limit";

describe("chat-rate-limit", () => {
  afterEach(() => {
    resetChatRateLimitForTests();
    delete process.env.CHAT_RATE_LIMIT_MAX;
    delete process.env.CHAT_RATE_LIMIT_WINDOW_MS;
    delete process.env.CHAT_RATE_LIMIT_DISABLED;
  });

  it("allows requests under the cap", () => {
    process.env.CHAT_RATE_LIMIT_MAX = "3";
    process.env.CHAT_RATE_LIMIT_WINDOW_MS = "60000";
    expect(takeChatRateToken("ip-a").ok).toBe(true);
    expect(takeChatRateToken("ip-a").ok).toBe(true);
    expect(takeChatRateToken("ip-a").ok).toBe(true);
  });

  it("blocks when cap exceeded", () => {
    process.env.CHAT_RATE_LIMIT_MAX = "2";
    process.env.CHAT_RATE_LIMIT_WINDOW_MS = "60000";
    expect(takeChatRateToken("ip-b").ok).toBe(true);
    expect(takeChatRateToken("ip-b").ok).toBe(true);
    const r = takeChatRateToken("ip-b");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.retryAfterSec).toBeGreaterThanOrEqual(1);
  });

  it("getChatClientKey reads x-forwarded-for", () => {
    const req = new Request("http://x", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });
    expect(getChatClientKey(req)).toBe("203.0.113.5");
  });
});
