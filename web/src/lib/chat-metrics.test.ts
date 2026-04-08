import { afterEach, describe, expect, it, vi } from "vitest";
import { getChatReplyTotals, recordChatReply, resetChatMetricsForTests } from "@/lib/chat-metrics";

describe("chat-metrics", () => {
  afterEach(() => {
    resetChatMetricsForTests();
    delete process.env.CHAT_METRICS_LOG;
    vi.restoreAllMocks();
  });

  it("increments totals by source", () => {
    recordChatReply("faq", 12);
    recordChatReply("faq", 8);
    recordChatReply("openai", 100);
    expect(getChatReplyTotals()).toEqual({ faq: 2, openai: 1 });
  });

  it("logs JSON when CHAT_METRICS_LOG is true", () => {
    process.env.CHAT_METRICS_LOG = "true";
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    recordChatReply("greeting", 5);
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('"event":"pantry_chat"'),
    );
    const line = spy.mock.calls[0]![0] as string;
    expect(JSON.parse(line).source).toBe("greeting");
  });
});
