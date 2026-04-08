import { NextResponse } from "next/server";
import faqBank from "@/data/mise-faq.json";
import { getCustomMiseFaq } from "@/lib/mise-custom-faq";
import { MISE_FALLBACK, MISE_OPENERS, MISE_GREETING_DEFAULT } from "@/lib/mise-personality";
import { findBestFaqMatch } from "@/lib/mise-match";
import type { MiseFaqRow } from "@/lib/mise-types";
import {
  cannedBusinessKitchenJoke,
  isPantryJokeRequest,
  routePantryGreeting,
} from "@/lib/pantry-chat-router";
import { recordChatReply } from "@/lib/chat-metrics";
import { getChatClientKey, takeChatRateToken } from "@/lib/chat-rate-limit";
import { getPortalSettings } from "@/lib/portal-settings";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

const staticBank = faqBank as MiseFaqRow[];

function openerFor(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return MISE_OPENERS[h % MISE_OPENERS.length];
}

/** Shared OpenAI call; returns trimmed text or null (caller logs failures in dev). */
async function openaiChatCompletion(
  openaiKey: string,
  system: string,
  userMessage: string,
  temperature: number,
  maxTokens: number,
): Promise<string | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMessage },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (reply) return reply;
      if (process.env.NODE_ENV !== "production") {
        console.warn("/api/chat openai: empty reply");
      }
    } else if (process.env.NODE_ENV !== "production") {
      console.warn("/api/chat openai non-ok status:", res.status);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("/api/chat openai exception:", error);
    }
  }
  return null;
}

/** JSON response + metrics row (source + duration only; no user text). */
function respondChat(
  payload: Record<string, unknown>,
  init: ResponseInit | undefined,
  startedAt: number,
): NextResponse {
  const src = typeof payload.source === "string" ? payload.source : "unknown";
  recordChatReply(src, Date.now() - startedAt);
  return NextResponse.json(payload, init);
}

export async function POST(req: Request) {
  const startedAt = Date.now();
  const clientKey = getChatClientKey(req);
  const rl = takeChatRateToken(clientKey);
  if (!rl.ok) {
    return respondChat(
      {
        error: "Too many messages right now. Please wait a moment and try again.",
        source: "rate_limited",
        retryAfter: rl.retryAfterSec,
      },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
      startedAt,
    );
  }

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 2000) {
    return NextResponse.json({ error: "Message required (max 2000 chars)" }, { status: 400 });
  }

  const portal = await getPortalSettings();
  if (portal.chatEnabled === false) {
    return respondChat(
      {
        reply: "Pantry is currently disabled. Please use the Contact page to reach Ethan directly.",
        source: "disabled",
      },
      { status: 503 },
      startedAt,
    );
  }

  const cannedGreeting = routePantryGreeting(message);
  if (cannedGreeting) {
    return respondChat({ reply: cannedGreeting, source: "greeting" }, undefined, startedAt);
  }

  // Joke requests skip FAQ so off-topic redirect rows don’t intercept with a dry reply.
  if (isPantryJokeRequest(message)) {
    const openaiKey = process.env.OPENAI_API_KEY;
    const jokeSys = `You are Pantry, the automated website assistant for ${siteConfig.name}, a kitchen design and cabinetry company in ${siteConfig.region}.
The user asked for humor. Reply with:
- ONE short, family-friendly joke, pun, or quip ONLY about kitchens, cabinets, remodeling, measuring (e.g. measure twice), appliances, interior design for homes, contractors, or the remodeling trade — tied to this business. No generic jokes (no animals crossing roads, no unrelated jobs or pop-culture riffs unless clearly about home/kitchens).
- The joke must never insult, roast, stereotype, or punch down at the customer (or any group). No humor at the visitor’s expense — only light, inanimate or trade humor.
- Stay PG. Do not claim to be human. Max 4 short sentences including one closing line that points to serious help (Services, Process, or Contact ${siteConfig.ownerName}).`;

    if (openaiKey) {
      const jokeReply = await openaiChatCompletion(openaiKey, jokeSys, message, 0.65, 220);
      if (jokeReply) {
        return respondChat({ reply: jokeReply, source: "joke" }, undefined, startedAt);
      }
    }
    return respondChat(
      { reply: cannedBusinessKitchenJoke(message), source: "joke" },
      undefined,
      startedAt,
    );
  }

  const custom = await getCustomMiseFaq();
  // Custom rows first so equal scores prefer Ethan's answers over generated FAQ.
  const bank: MiseFaqRow[] = [...custom, ...staticBank];
  const match = findBestFaqMatch(message, bank);

  if (match) {
    const text = openerFor(message) + match.row.a;
    return respondChat(
      { reply: text, source: "faq", faqId: match.row.id },
      undefined,
      startedAt,
    );
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    // This path runs only when the FAQ bank did not match — try to help, but every answer must land on TCK.
    const sys = `You are Pantry, the automated website assistant for ${siteConfig.name}, a kitchen design and cabinetry company in ${siteConfig.region}.
You are answering a question that did not match our fixed FAQ, so the visitor needs a thoughtful reply — not a brush-off.

**Respect and safety (non-negotiable):**
- Never insult, mock, belittle, shame, or talk down to the visitor. No passive-aggressive digs, no “clapback,” no implying they are stupid, cheap, difficult, or a waste of time.
- Do **not** reply with sarcasm **aimed at the customer**. Do not mimic rude or hostile tone back at them. If they sound angry or frustrated, stay calm, brief, and kind.
- No stereotypes, slurs, edgy humor, or humor that punches down. If you use wit, it must be gentle and never at a person’s expense.

**Tone, sarcasm, and sounding smart:**
- If the message sounds **sarcastic, ironic, playful, or teasing**, you may show you understood the subtext with **at most one short sentence** of warm, good-natured cleverness — e.g. light self-deprecation as a bot, or a mild observation about kitchens/renos — then **immediately** pivot to a sincere, helpful answer about their real need and ${siteConfig.name}.
- Sound **perceptive and articulate** (clear structure, precise words) without being cold. Prefer helpful substance over empty banter.

Rules:
- Keep replies under about 120 words unless the question clearly needs a bit more; stay clear and friendly.
- **Try to answer** the user’s question in good faith when you can do so safely and briefly (general knowledge, loose analogies to home projects, high-level design or planning ideas). When the topic is only loosely related, acknowledge it in one short line, then connect it to kitchens, cabinetry, remodeling, timelines, consults, or working with a local designer.
- **Always** bring the close back to this business: what ${siteConfig.name} does (kitchen design & cabinetry, process, service area, booking a consult) and how to get real answers from ${siteConfig.ownerName} via the Contact page, phone ${siteConfig.phoneDisplay}, or email ${siteConfig.email}. Mention /services, /process, or /contact when it fits naturally.
- Do **not** claim to be human. No roleplay.
- Do **not** give medical, legal, or financial advice; do not help with anything illegal, harmful, or explicit. For those, refuse the substance in one sentence and pivot to contacting ${siteConfig.ownerName} for project questions only.
- Never invent exact prices, binding guarantees, permit outcomes, or technical specs you are unsure about — offer ranges or “depends on the space” and suggest a consult.
- Straight “tell me a joke” requests are handled elsewhere; if someone asks only for a joke here, give one kitchen/remodel-themed line then pivot to business help.`;

    const reply = await openaiChatCompletion(openaiKey, sys, message, 0.45, 360);
    if (reply) {
      return respondChat({ reply, source: "openai" }, undefined, startedAt);
    }
  }

  return respondChat(
    {
      reply: MISE_FALLBACK,
      source: "fallback",
      greetingHint: portal.chatGreeting ?? MISE_GREETING_DEFAULT,
    },
    undefined,
    startedAt,
  );
}

export async function GET() {
  const portal = await getPortalSettings();
  return NextResponse.json({
    enabled: portal.chatEnabled !== false,
    greeting: portal.chatGreeting ?? MISE_GREETING_DEFAULT,
    footerNote:
      portal.chatFooterNote ??
      `For project-specific answers, contact ${siteConfig.ownerName} — see Contact.`,
  });
}
