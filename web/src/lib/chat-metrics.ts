/**
 * Optional counters + structured logs for Pantry chat (no user message content).
 *
 * Set CHAT_METRICS_LOG=true to emit one JSON line per completed chat response
 * for log aggregators (source + duration only).
 */

const totals: Record<string, number> = {};

export function recordChatReply(source: string, durationMs: number): void {
  totals[source] = (totals[source] ?? 0) + 1;
  if (process.env.CHAT_METRICS_LOG === "true") {
    console.log(
      JSON.stringify({
        event: "pantry_chat",
        source,
        durationMs: Math.round(durationMs),
      }),
    );
  }
}

/** Introspection for tests or future admin tooling. */
export function getChatReplyTotals(): Record<string, number> {
  return { ...totals };
}

/** Vitest cleanup. */
export function resetChatMetricsForTests(): void {
  for (const k of Object.keys(totals)) {
    delete totals[k];
  }
}
