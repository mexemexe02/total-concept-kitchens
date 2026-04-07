import { NextResponse } from "next/server";
import faqBank from "@/data/mise-faq.json";
import { getCustomMiseFaq } from "@/lib/mise-custom-faq";
import { MISE_FALLBACK, MISE_OPENERS, MISE_GREETING_DEFAULT } from "@/lib/mise-personality";
import { findBestFaqMatch } from "@/lib/mise-match";
import type { MiseFaqRow } from "@/lib/mise-types";
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
      const sys = `You are Mise, the upbeat but professional virtual assistant for ${siteConfig.name}, a custom kitchen design and cabinetry company in ${siteConfig.region} led by ${siteConfig.ownerName}. 
Rules: Keep answers under 120 words. Use a warm, slightly playful tone (light kitchen wordplay allowed, not cheesy). If you are unsure or the question needs a site visit, say so and direct them to phone ${siteConfig.phoneDisplay} or email ${siteConfig.email}. Never invent prices or guarantees.`;

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
          temperature: 0.7,
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
      }
    } catch {
      /* fall through */
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
    greeting: portal.chatGreeting ?? MISE_GREETING_DEFAULT,
    footerNote:
      portal.chatFooterNote ??
      `For project-specific answers, contact ${siteConfig.ownerName} — see Contact.`,
  });
}
