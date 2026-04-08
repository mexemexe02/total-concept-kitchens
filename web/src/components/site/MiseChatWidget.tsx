"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { MISE_BOT_NAME, MISE_BOT_TAGLINE } from "@/lib/mise-personality";

type Msg = { role: "user" | "mise"; text: string };

type Props = {
  initialGreeting: string;
  footerNote: string;
};
type ChatSource = "faq" | "openai" | "fallback" | "greeting" | "disabled";

const ease = [0.22, 1, 0.36, 1] as const;

function TypingIndicator() {
  return (
    <div
      className="mr-4 inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-stone-200 bg-white px-4 py-3 dark:border-stone-600 dark:bg-stone-900"
      role="status"
      aria-live="polite"
      aria-label={`${MISE_BOT_NAME} is typing`}
    >
      <span className="sr-only">Typing</span>
      <span className="h-2 w-2 rounded-full bg-bronze/70 motion-safe:animate-mise-dot dark:bg-bronze-light/80" />
      <span className="h-2 w-2 rounded-full bg-bronze/70 motion-safe:animate-mise-dot [animation-delay:160ms] dark:bg-bronze-light/80" />
      <span className="h-2 w-2 rounded-full bg-bronze/70 motion-safe:animate-mise-dot [animation-delay:320ms] dark:bg-bronze-light/80" />
    </div>
  );
}

/**
 * Floating Pantry assistant — matches site bronze/charcoal styling.
 * Answers from FAQ bank + optional OpenAI when `OPENAI_API_KEY` is set server-side.
 */
export function MiseChatWidget({ initialGreeting, footerNote }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [lastSource, setLastSource] = useState<ChatSource | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const debugSource = process.env.NEXT_PUBLIC_CHAT_DEBUG === "true";

  useEffect(() => {
    if (!open || msgs.length > 0) return;
    setMsgs([{ role: "mise", text: initialGreeting }]);
  }, [open, initialGreeting, msgs.length]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, pending]);

  const send = useCallback(async () => {
    const t = input.trim();
    if (!t || pending) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t }),
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        source?: ChatSource;
      };
      const reply =
        data.reply ?? data.error ?? "Something went wrong — try the Contact page.";
      setLastSource(data.source ?? null);
      setMsgs((m) => [...m, { role: "mise", text: reply }]);
    } catch {
      setLastSource(null);
      setMsgs((m) => [
        ...m,
        {
          role: "mise",
          text: "Connection hiccup — please try again or use the Contact page.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }, [input, pending]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          open
            ? "pointer-events-none fixed bottom-5 right-5 z-[60] opacity-0"
            : "fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-cream shadow-lg transition hover:bg-bronze hover:text-charcoal dark:bg-bronze dark:text-charcoal dark:hover:bg-bronze-light"
        }
        aria-label={`Open ${MISE_BOT_NAME} chat`}
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        Ask {MISE_BOT_NAME}
      </button>

      {open ? (
        <motion.div
          className="fixed bottom-5 right-5 z-[60] flex w-[min(100vw-1.5rem,22rem)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-cream shadow-2xl dark:border-stone-700 dark:bg-charcoal"
          role="dialog"
          aria-label={`${MISE_BOT_NAME} chat`}
          initial={
            reduce
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 16, scale: 0.96 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.32, ease }}
        >
          <div className="flex items-center justify-between border-b border-stone-200 bg-charcoal px-4 py-3 text-cream dark:border-stone-700">
            <div>
              <p className="text-sm font-semibold">{MISE_BOT_NAME}</p>
              <p className="text-xs text-stone-400">{MISE_BOT_TAGLINE}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 transition hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div
            ref={listRef}
            className="max-h-72 space-y-3 overflow-y-auto px-3 py-3 text-sm"
          >
            {msgs.map((m, i) => (
              <motion.div
                key={`${i}-${m.role}`}
                initial={
                  reduce
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 10, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: reduce ? 0 : 0.32, ease }}
                className={
                  m.role === "user"
                    ? "ml-6 rounded-2xl rounded-br-md bg-stone-200 px-3 py-2 text-charcoal dark:bg-stone-700 dark:text-cream"
                    : "mr-4 rounded-2xl rounded-bl-md border border-stone-200 bg-white px-3 py-2 text-stone-800 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100"
                }
              >
                {m.text}
              </motion.div>
            ))}
            {pending ? <TypingIndicator /> : null}
          </div>
          <div className="border-t border-stone-200 p-2 dark:border-stone-700">
            <div className="flex gap-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about kitchens…"
                className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-cream"
                maxLength={2000}
                aria-label="Message"
              />
              <button
                type="button"
                onClick={send}
                disabled={pending}
                className="rounded-full bg-bronze p-2 text-charcoal transition hover:bg-bronze-light disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 px-1 text-[10px] leading-snug text-stone-500 dark:text-stone-500">
              {footerNote}
            </p>
            {debugSource && lastSource ? (
              <p className="mt-1 px-1 text-[10px] font-medium uppercase tracking-wide text-stone-500 dark:text-stone-500">
                source: {lastSource}
              </p>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </>
  );
}
