"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/gallery-types";

type Props = {
  items: GalleryItem[];
  source: "instagram" | "fallback";
};

function isRemoteImageSrc(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

/**
 * Click-to-expand lightbox with keyboard nav (Escape / arrows) and focus return.
 * Keeps Instagram tiles in-app for a more “designed” feel; optional link to the post.
 */
export function GalleryTiles({ items, source }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  /** Labels the dialog title for `aria-labelledby` (stable while lightbox is open). */
  const dialogTitleId = useId();

  const open = openIndex !== null;
  const current = openIndex !== null ? items[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);
  const go = useCallback(
    (dir: -1 | 1) => {
      if (openIndex === null || items.length === 0) return;
      const n = (openIndex + dir + items.length) % items.length;
      setOpenIndex(n);
    },
    [openIndex, items.length],
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, go]);

  return (
    <>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex flex-col overflow-hidden rounded-2xl bg-stone-200 shadow-sm dark:bg-stone-800"
          >
            <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="group relative block h-full w-full cursor-zoom-in text-left"
                aria-haspopup="dialog"
                aria-label={`Enlarge: ${item.alt}`}
              >
                {item.source === "fallback" && !isRemoteImageSrc(item.src) ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={index === 0}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : item.source === "fallback" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </button>
            </div>
            {item.caption ? (
              <p className="line-clamp-4 border-t border-stone-300/80 p-3 text-sm leading-snug text-stone-700 dark:border-stone-600 dark:text-stone-300">
                {item.caption}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && current ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-charcoal/85 backdrop-blur-md"
              aria-label="Close gallery"
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              className="relative z-[71] flex max-h-[min(92vh,920px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-stone-200 bg-cream shadow-2xl dark:border-stone-700 dark:bg-charcoal"
              initial={
                reduce
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.97, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, y: 8 }
              }
              transition={{
                duration: reduce ? 0 : 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-stone-200 px-3 py-2 dark:border-stone-700 sm:px-4">
                <p
                  id={dialogTitleId}
                  className="min-w-0 truncate text-sm font-medium text-charcoal dark:text-cream"
                >
                  {source === "instagram" ? "Instagram" : "Project"} photo{" "}
                  {openIndex !== null ? openIndex + 1 : 0} / {items.length}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  {items.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        className="rounded-full p-2 text-charcoal transition hover:bg-stone-200 dark:text-cream dark:hover:bg-stone-800"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        className="rounded-full p-2 text-charcoal transition hover:bg-stone-200 dark:text-cream dark:hover:bg-stone-800"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  ) : null}
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    className="rounded-full p-2 text-charcoal transition hover:bg-stone-200 dark:text-cream dark:hover:bg-stone-800"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="relative flex min-h-0 flex-1 items-center justify-center bg-stone-100 p-3 dark:bg-stone-950 sm:p-6">
                <div className="relative h-[min(72vh,720px)] w-full">
                  {current.source === "fallback" &&
                  !isRemoteImageSrc(current.src) ? (
                    <Image
                      src={current.src}
                      alt={current.alt}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  ) : current.source === "fallback" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.src}
                      alt={current.alt}
                      className="mx-auto h-full max-h-[min(72vh,720px)] w-auto max-w-full object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.src}
                      alt={current.alt}
                      className="mx-auto h-full max-h-[min(72vh,720px)] w-auto max-w-full object-contain"
                    />
                  )}
                </div>
              </div>
              {(current.caption || current.href) && (
                <div className="border-t border-stone-200 px-4 py-3 text-sm dark:border-stone-700">
                  {current.caption ? (
                    <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                      {current.caption}
                    </p>
                  ) : null}
                  {current.href ? (
                    <a
                      href={current.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-medium text-bronze underline-offset-2 hover:underline dark:text-bronze-light"
                    >
                      {source === "instagram"
                        ? "Open this post on Instagram"
                        : "View link"}
                    </a>
                  ) : null}
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
