import type { MiseFaqRow } from "@/lib/mise-types";

/**
 * Words that appear in almost every FAQ question — counting them caused false
 * matches (e.g. "do you do washrooms" only shared "you" with "Do you provide 3D…").
 */
const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "your",
  "can",
  "how",
  "what",
  "when",
  "where",
  "why",
  "who",
  "will",
  "would",
  "could",
  "should",
  "shall",
  "may",
  "might",
  "must",
  "this",
  "that",
  "with",
  "from",
  "into",
  "about",
  "than",
  "then",
  "them",
  "they",
  "their",
  "there",
  "here",
  "have",
  "has",
  "had",
  "was",
  "were",
  "been",
  "being",
  "does",
  "did",
  "get",
  "got",
  "also",
  "only",
  "both",
  "each",
  "some",
  "any",
  "all",
  "our",
  "out",
  "its",
  "use",
  "using",
  "used",
  "she",
  "her",
  "him",
  "his",
  "too",
  "very",
  "just",
  "per",
  "via",
  "way",
  "new",
  "now",
  "one",
  "two",
  "let",
]);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  return normalize(s)
    .split(" ")
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Token overlap scorer — fast, no extra deps. Returns best row + score 0..1.
 */
export function findBestFaqMatch(
  message: string,
  bank: MiseFaqRow[],
): { row: MiseFaqRow; score: number } | null {
  const qTokens = new Set(tokens(message));
  // Avoid matching the whole bank on empty / generic-only questions.
  if (qTokens.size === 0) return null;

  let best: MiseFaqRow | null = null;
  let bestScore = 0;

  for (const row of bank) {
    const hay = [row.q, ...(row.tags ?? [])].join(" ");
    const docTokens = tokens(hay);
    if (docTokens.length === 0) continue;
    let hit = 0;
    for (const t of docTokens) {
      if (qTokens.has(t)) hit += 1;
    }
    const score = hit / Math.sqrt(docTokens.length * qTokens.size);
    if (score > bestScore) {
      bestScore = score;
      best = row;
    }
  }

  if (!best || bestScore < 0.12) return null;
  return { row: best, score: bestScore };
}
