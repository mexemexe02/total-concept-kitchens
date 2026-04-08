import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getChatReplyTotals } from "@/lib/chat-metrics";
import { verifyPortalSession } from "@/lib/portal-session";

export const runtime = "nodejs";

function authorized(): boolean {
  const secret = process.env.TCK_PORTAL_SECRET?.trim() ?? "";
  const token = cookies().get("tck_portal_sess")?.value;
  return Boolean(secret && verifyPortalSession(token, secret));
}

/**
 * In-memory reply-path counts since last Node process start.
 * No user message content — safe for Ethan to spot FAQ gaps (high openai/fallback).
 */
export async function GET() {
  if (!authorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    totals: getChatReplyTotals(),
    since: "server_process_start",
    disclaimer:
      "Counts are kept in this server instance only and reset when the app restarts. If you run multiple containers, each has its own totals — use CHAT_METRICS_LOG or proxy logs for global views.",
  });
}
