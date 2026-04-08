import { NextResponse } from "next/server";
import faqBank from "@/data/mise-faq.json";
import { getCustomMiseFaq } from "@/lib/mise-custom-faq";
import { MISE_FALLBACK, MISE_OPENERS, MISE_GREETING_DEFAULT } from "@/lib/mise-personality";
import { findBestFaqMatch } from "@/lib/mise-match";
import type { MiseFaqRow } from "@/lib/mise-types";
import { routePantryGreeting } from "@/lib/pantry-chat-router";
import { getPortalSettings } from "@/lib/portal-settings";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

const staticBank = faqBank as MiseFaqRow[];

function openerFor(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return MISE_OPENERS[h % MISE_OPENERS.length];
}

export async function POST(req: Request) {
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
    return NextResponse.json(
      {
        reply: "Pantry is currently disabled. Please use the Contact page to reach Ethan directly.",
        source: "disabled",
      },
      { status: 503 },
    );
  }

  const cannedGreeting = routePantryGreeting(message);
  if (cannedGreeting) {
    return NextResponse.json({ reply: cannedGreeting, source: "greeting" });
  }

  const custom = await getCustomMiseFaq();
  // Custom rows first so equal scores prefer Ethan's answers over generated FAQ.
  const bank: MiseFaqRow[] = [...custom, ...staticBank];
  const match = findBestFaqMatch(message, bank);

  if (match) {
    const text = openerFor(message) + match.row.a;
    return NextResponse.json({
      reply: text,
      source: "faq",
      faqId: match.row.id,
    });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const sys = `You are Pantry, the automated website assistant for ${siteConfig.name}, a kitchen design and cabinetry company in ${siteConfig.region}.
Rules:
- Keep replies under 90 words and stay concise.
- Scope is ONLY this business: services, timelines, process, service area, booking, and contact info.
- For unrelated prompts (recipes, trivia, coding, homework, etc.), politely decline in one sentence and immediately redirect to site-relevant help (services/process/contact).
- Do not claim to be a human. Do not use roleplay.
- Never invent prices, guarantees, legal advice, or technical details you are unsure about.
- When uncertain, direct people to ${siteConfig.ownerName} at ${siteConfig.phoneDisplay} or ${siteConfig.email}.`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini",
          messages: [
            { role: "system", content: sys },
            { role: "user", content: message },
          ],
          max_tokens: 280,
          temperature: 0.4,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return NextResponse.json({ reply, source: "openai" });
        }
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
  }

  return NextResponse.json({
    reply: MISE_FALLBACK,
    source: "fallback",
    greetingHint: portal.chatGreeting ?? MISE_GREETING_DEFAULT,
  });
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
