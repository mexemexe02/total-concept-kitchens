# Development log — Total Concept Kitchens

## 2026-04-08 — Portal simple CRM (`content/crm-leads.json`)

### What shipped
- **`web/content/crm-leads.json`** — append-only style storage (max 500 rows) for manual leads.
- **`web/src/lib/crm-types.ts`**, **`crm-leads.ts`** — types + parse/save helpers.
- **`GET/POST/PATCH/DELETE /api/portal/crm`** — portal cookie auth; PATCH updates fields; DELETE `?id=`.
- **`PortalCrmSection.tsx`** — add form + list with status dropdown, blur-to-save fields, remove. Replaced the old dashed “reserved” placeholder block.
- **`DEPLOY.md`** — note `crm-leads.json` needs writable `content/`.

---

## 2026-04-08 — Portal: reserved “Leads & visitors” (2b) — superseded

- Earlier placeholder section; replaced by **simple CRM** (see entry above). Pantry still does not auto-create CRM rows.

---

## 2026-04-08 — Portal Pantry insights (owner-only)

### Why
- Completed the “review real chats” loop without storing user messages: Ethan sees **which reply paths** fire (faq vs openai vs fallback, etc.) to decide new custom Q&A.

### What shipped
- **`GET /api/portal/chat-insights`** — same cookie auth as other portal APIs; returns `getChatReplyTotals()` + disclaimer (per-instance, since restart).
- **`PortalClient`** — section **2 · Pantry** shows a small **usage** panel when insights load.

---

## 2026-04-08 — High-value Pantry ops: rate limit, metrics, starter custom FAQ

### Rate limiting
- **`web/src/lib/chat-rate-limit.ts`** — sliding window per client key from `X-Forwarded-For` / `X-Real-IP`; env `CHAT_RATE_LIMIT_MAX` (default 30), `CHAT_RATE_LIMIT_WINDOW_MS` (default 60000), `CHAT_RATE_LIMIT_DISABLED` for tests.
- **`POST /api/chat`** returns **429** + `source: "rate_limited"` + `Retry-After` when exceeded. In-memory = **per Node process**; `DEPLOY.md` notes multi-replica / proxy limits.

### Metrics
- **`web/src/lib/chat-metrics.ts`** — increments in-memory totals by `source`; `CHAT_METRICS_LOG=true` logs one JSON line per reply (`event`, `source`, `durationMs` only).

### Starter owner FAQ
- **`web/content/mise-custom-faq.json`** — eight defer-to-Ethan policy Q&As (editable in portal). **`FAQ_ANSWERS_NEEDED_FROM_OWNER.md`** updated to mention starters.

### Tests
- `chat-rate-limit.test.ts`, `chat-metrics.test.ts`.

---

## 2026-04-08 — Pantry: no insults; smart handling of visitor sarcasm

### Why
- Owner wants Pantry to **never insult** customers, but to **notice sarcasm/irony** and respond in a **clever, perceptive** way (without punching back or mocking the visitor).

### What changed
- **`/api/chat` OpenAI system prompt:** hard rules — no mockery, belittling, passive-aggression, sarcasm **at** the user, “clapback,” or rude mimicry; stay kind if they’re frustrated. Optional **one short** line of warm wit (self-deprecating bot humor or mild reno/kitchen observation) when tone is playful/sarcastic, then **sincere** pivot to TCK help. Joke path: no roasts or humor at the customer’s expense.
- **`MISE_OPENERS`:** replaced “Love this one —” with “Thanks for asking —” so FAQ matches never sound flippant next to an upset or sarcastic message.

---

## 2026-04-08 — More generated FAQs + owner review checklist

### What changed
- **`web/scripts/generate-mise-faq.mjs`** — added ~35 clusters (payment/deposit, consult fee, warranty, insurance, min project, customer-supplied items, financing, design-build, shop drawings, door styles, two-tone, waterfall edge, work triangle, uppers height, undermount + laminate, measure prep, consult photos, hardware finishes, open shelving vs uppers, steam oven planning, kitchen desk, noise/quiet hours, working with designers, trim matching). Raised cap **660 → 720** on filler/city/consult/off-topic loops so expansion is not truncated early.
- **`web/content/FAQ_ANSWERS_NEEDED_FROM_OWNER.md`** — checklist of topics **Ethan should answer or approve** (money, warranty, insurance, scope, lead times, etc.) so we do not invent binding policies in FAQ or OpenAI.

### Regenerate data
- `cd web && node scripts/generate-mise-faq.mjs` (or `npm run build` via prebuild).

---

## 2026-04-08 — OpenAI path: answer non-FAQ questions, always pivot to TCK

### Why
- Owner wanted Pantry to **try to answer** questions that don’t hit the FAQ, not only refuse and redirect.

### What changed
- **`/api/chat`** main OpenAI system prompt (no FAQ match): instruct model to answer **in good faith** when safe/brief, **always** close with services/process/contact and real contact fields from `site-config`; caps ~120 words; stricter blocks for medical/legal/financial/harmful; no invented prices/guarantees. Slightly higher **temperature 0.45** and **max_tokens 360** for room to bridge topics.

---

## 2026-04-08 — Pantry: business-only jokes (`source: joke`)

### Why
- “Tell me a joke” matched off-topic **FAQ** rows and returned the dry redirect (with a FAQ opener), which felt like the API was “broken.”

### What changed
- **`isPantryJokeRequest`** + **`cannedBusinessKitchenJoke`** in `pantry-chat-router.ts` — detect joke asks (before FAQ).
- **`/api/chat`** — joke path **skips FAQ**; calls OpenAI with a strict **kitchen/remodel/trade-only** humor system prompt (`temperature` 0.65); on failure or no API key, returns a **canned** PG one-liner from a small pool.
- Response **`source: "joke"`** for debug (`MiseChatWidget` union updated). **`verify-chat-api.mjs`** asserts POST `tell me a joke` → `joke`.

---

## 2026-04-08 — Live verification: `/api/chat`

### What we checked (dev server on port 3012)
- **GET `/api/chat`** — returns JSON with `enabled: true` and a non-empty `greeting` (widget bootstrap).
- **POST `{"message":"hi"}`** — **200**, `source: "greeting"`, reply introduces Pantry and points to contact.
- **POST `{"message":""}`** — **400**, `error` explains message required.
- **POST** (service-area style question) — **200**, `source: "faq"` with `faqId` (matches generated bank in this environment).

### Repeat locally
- Start app: `cd web && npm run dev`
- In another shell: `cd web && npm run verify:chat-api`
- Optional: `CHAT_API_BASE=https://your-staging.example npm run verify:chat-api`

**Note:** OpenAI path (`source: openai`) is not asserted here (depends on `OPENAI_API_KEY` and no strong FAQ match). Test that manually if the key is set.

---

## 2026-04-08 — Dev site looked “broken” / unstyled (Next chunk 404s)

### Cause
- The browser requested `/_next/static/chunks/webpack.js`, `main-app.js`, `app/layout.js`, etc. and got **404**.
- That usually means **`.next` was deleted or replaced while `next dev` was still running** on port 3012. The old process kept serving HTML that pointed at chunk files that no longer existed, so CSS/JS failed and the page looked unstyled.

### Fix applied (local)
- Found PID on port 3012 (`Get-NetTCPConnection -LocalPort 3012`), stopped it, then ran `npm run dev` from `web/` so Next rebuilt `.next`.

### How to avoid
- Before `npm run clean`, **stop** the dev server, **or** use `dev:clean` only when nothing is listening on 3012.
- If the UI looks raw again: stop dev → `npm run clean` → `npm run dev`.

### Verify
- DevTools **Network**: `/_next/static/chunks/webpack.js` and `main-app.js` return **200**.
- Home page shows normal layout and Tailwind styling.

### Follow-up (same day)
- `cd web && npm run test -- --run` — **12 tests passed**.
- `cd web && npm run build` — **succeeds** (prebuild regenerated FAQ JSON as usual).
- Dev server on 3012 still **Ready**; Next may log `HEAD .../webpack.js 404` for probes without the `?v=` query — normal; full GET with query from HTML is **200**.

---

## 2026-04-08 — Pantry hardening: greeting router, portal toggle, FAQ expansion

### Why
- Testers reported silly off-topic replies and no easy owner kill-switch for chat.
- We needed a reliable way to verify whether replies came from FAQ or OpenAI.

### What shipped
- **`web/src/lib/pantry-chat-router.ts`** + test — routes short greetings (`hi`, `hello`, etc.) to a fixed Pantry intro with contact guidance.
- **`web/src/app/api/chat/route.ts`** — added `source: "greeting"` path, stronger OpenAI system rules (scope-limited, off-topic refusal + redirect), lower temperature (`0.4`), and dev-only warning logs for non-OK/empty/exception OpenAI responses.
- **Portal toggle:** `chatEnabled` added across settings model/defaults/persistence (`mise-types`, `portal-defaults`, `portal-mutable-keys`, `portal-settings`, portal settings API). `PortalClient` now has an enable checkbox under Pantry settings.
- **Public behavior:** root layout renders chat widget only when `chatEnabled !== false`; `/api/chat` returns `source: "disabled"` and skips FAQ/OpenAI when disabled.
- **Pantry naming/copy:** bot identity text updated in `mise-personality`; portal labels updated from “Mise” to “Pantry” in chat sections.
- **Debug proof path:** `MiseChatWidget` can show `source` when `NEXT_PUBLIC_CHAT_DEBUG=true`; `.env.example` documents the flag.
- **FAQ expansion:** `generate-mise-faq.mjs` extended with additional consult/off-topic clusters and guaranteed filler block; regenerated **`web/src/data/mise-faq.json`** to **620 rows**.

### Verify
- `cd web && npm run test -- --run` — **12 tests passed** (includes new `pantry-chat-router` tests).
- `cd web && npm run build` — succeeds; `/api/chat` and `/api/portal/*` routes compile cleanly.
- Manual checks:
  - `/portal` → toggle Pantry off → widget hidden from public pages and `/api/chat` returns disabled source.
  - `POST /api/chat` with `hi` returns greeting source.
  - With `NEXT_PUBLIC_CHAT_DEBUG=true`, widget shows backend source tag (`faq/openai/fallback/greeting/disabled`).

---

## 2026-04-08 — Dark mode: root tokens + `DarkModeSync`

### Problem
- `body` always used cream `--background` from `:root`; `html.dark` never updated CSS variables, so many areas looked “not really dark.”
- Inline `dark` script did not run after Next.js **client** navigations, so `dark:` utilities could stay off.

### Fix
- **`globals.css`:** `html.dark { color-scheme: dark; --background: #1c1b19; --foreground: #f7f5f0; }` so the page canvas matches dark sections.
- **`DarkModeSync`:** client component (Suspense in root layout) mirrors the same rules as the inline script on route/search change + `prefers-color-scheme` changes.

---

## 2026-04-08 — Dark mode preview URL (`?dark=1`)

### Why
- Cursor’s embedded browser cannot toggle “Emulate prefers-color-scheme: dark” like Chrome DevTools, and a light OS never activates Tailwind’s old default `media` dark variant.

### Changes
- **`tailwind.config.ts`:** `darkMode: "class"` — `dark:` applies when `<html>` has class `dark`.
- **`app/layout.tsx`:** Inline script in `<head>` (before paint): `?dark=1` adds `dark` on `<html>`; `?dark=0` forces light; otherwise `prefers-color-scheme: dark` adds `dark` (same behavior as before for dark OS users). `suppressHydrationWarning` on `<html>` for the class mismatch.

### Verify
- **http://localhost:3012/?dark=1** — force dark on a light OS. **http://localhost:3012/?dark=0** — force light on a dark OS.

---

## 2026-04-06 — Header + logo: always light chrome (dark OS safe)

### Why
- Official logo must not change colour or use filters; transparent areas were reading wrong on `dark:bg-charcoal` header.

### Changes
- **`Header`:** Removed `dark:` variants — bar, nav, CTA, and mobile sub-nav stay cream/light styling in all themes. Page body below can still use dark mode.
- **`LogoOrWordmark` / `BrandWordmark`:** Dropped `dark:` ring-offset and wordmark tweaks so ring halo stays `ring-offset-cream` with the light header.

### Verify
- DevTools → emulate `prefers-color-scheme: dark` — header and logo should match light appearance; scroll page to confirm dark sections still work.

---

## 2026-04-05 — Mise custom Q&A (portal + `content/mise-custom-faq.json`)

### Why
- Ethan can add exact question/answer pairs without editing the large generated `mise-faq.json` or redeploying FAQ generation.

### What shipped
- **`web/content/mise-custom-faq.json`** — JSON array of `{ id, q, a, tags? }`; committed default `[]`.
- **`web/src/lib/mise-custom-faq.ts`** — `getCustomMiseFaq`, `saveCustomMiseFaq`, `parseCustomFaqJson`; save rewrites ids as **-1, -2, …** to avoid clashing with positive ids in `src/data/mise-faq.json`.
- **`GET/POST /api/portal/mise-faq`** — same cookie auth as portal settings.
- **`/api/chat`** — builds `bank = [...custom, ...static]` so custom rows are evaluated first (tie-breaking in matcher favors earlier rows).
- **Portal** — section **11 · Mise custom Q&A**: add/remove rows, optional comma-separated tags, **Save Mise Q&A** (separate from “Save all changes”). Load runs `settings` + `mise-faq` in parallel after login.
- **Tests** — `web/src/lib/mise-custom-faq.test.ts` for `parseCustomFaqJson`.

### Verify
- `cd web && npm run test -- --run` and `npm run build` — OK.
- Local: sign in at `/portal`, add a pair, save; ask Mise the same question; response should use your answer when overlap score clears the threshold.

### Deploy note
- Coolify (or any Docker host) must persist **`web/content/`** writable if Ethan saves from production — same as `portal-settings.json`.

---

## 2026-04-07 — Next.js `web/` app wired and dev server

### Problem
- Next.js app lived under `web/` (with `next.config.mjs`, `src/app`) but root `package.json` / `tsconfig.json` did not match that layout, and `web/package.json` was missing despite `web/package-lock.json`.

### Changes
- Added `web/package.json` (deps aligned with lockfile: Next 14.2.35, Supabase, Framer Motion, Lucide, etc.).
- Dev and production start scripts use **port 3011** (`next dev -p 3011`, `next start -p 3011`) to avoid ports 3000–3010.
- Added `web/tsconfig.json` (paths `@/*` → `./src/*`).
- Root `package.json` is a thin delegator: `npm run dev` → `npm run dev --prefix web`.
- Removed root `tsconfig.json` (TypeScript config now only under `web/`).

### Verify
- From repo root: `npm run dev`  
- Or: `cd web && npm run dev`  
- Open **http://localhost:3011**

### Commands run
- `npm ci` in `web/` — OK  
- `npm run build` in `web/` — OK  

---

## 2026-04-07 — Coolify + Cloudflare (no Vercel)

### Changes
- `web/next.config.mjs`: `output: "standalone"` for Docker self-hosting.
- Added `web/Dockerfile` (multi-stage Node 20 Alpine) and `web/.dockerignore`.
- Added `web/public/.gitkeep` so Docker `COPY public` always succeeds.
- Root **`DEPLOY.md`**: Coolify settings (context `web/`, port 3000) + Cloudflare DNS/proxy/Tunnel notes.
- **`web/README.md`**: removed Vercel deploy section; points to `DEPLOY.md`.
- **`web/src/app/page.tsx`**: removed Vercel CTAs; links to Next.js self-hosting / Docker docs.

### Verify
- `npm run build` in `web/` — OK (standalone trace generated).
- Optional: `docker build -t tck-web ./web` then `docker run --rm -p 3011:3000 tck-web`.

---

## 2026-04-07 — Marketing homepage (local preview only)

### What shipped
- Full single-page site: `Header`, `HeroSection`, `ServicesSection`, `ProcessSection`, `GallerySection`, `ContactSection`, `Footer` under `web/src/components/site/`.
- `web/src/lib/site-config.ts` — business name, tagline, placeholder phone/email/location (edit before launch).
- `web/src/lib/utils.ts` — `cn()` for Tailwind class merging.
- Tailwind brand palette (`cream`, `charcoal`, `bronze`, `bronze-light`) + Geist as `font-sans`.
- `globals.css` — smooth scroll, warm light/dark roots.
- `next.config.mjs` — `images.unsplash.com` allowed for hero/gallery preview photos.
- `layout.tsx` — metadata + Open Graph using `siteConfig.url` (defaults to localhost for local preview).

### Verify locally
- `npm run dev` from repo root or `web/` → **http://localhost:3011**
- `npm run build` in `web/` — OK

---

## 2026-04-07 — Multi-page site (App Router)

### Why
- Single long page with `#anchors` is not how the live site should behave; user wanted real URLs and navigation like production.

### Structure
- Route group `src/app/(site)/` — URLs are still `/`, `/services`, etc. (parentheses do not appear in the path).
- `(site)/layout.tsx` wraps **Header** + **Footer** on every marketing page.
- Pages: `page.tsx` (home), `services/page.tsx`, `process/page.tsx`, `gallery/page.tsx`, `contact/page.tsx`, `about/page.tsx`.
- `src/lib/nav.ts` drives header links (real paths, not hash links).
- `PageHeader` component for inner pages (H1 + intro).
- Home: `HeroSection` + `HomeHighlights` (cards linking to each section page).
- `src/app/not-found.tsx` — 404 with same chrome as the rest of the site.

### Verify
- `npm run build` — lists static routes for `/`, `/about`, `/contact`, `/gallery`, `/process`, `/services`.

---

## 2026-04-07 — Facebook / Instagram + Instagram gallery sync

### Context
- User provided official profiles: [Facebook — Total Concept Kitchens](https://www.facebook.com/p/Total-Concept-Kitchens-100031038951078/), [Instagram @totalconceptkitchens](https://www.instagram.com/totalconceptkitchens/).
- Requested scraping/download of all media; **not implemented** (Meta ToS + brittle). **Instagram Graph API** used instead for automatic gallery updates when env vars are set.

### Code
- `site-config.ts`: `social.facebookUrl`, `social.instagramUrl`, `social.instagramHandle`, `ownerName` / `ownerRole` (Ethan).
- `SocialLinks.tsx` + footer “Follow us” + contact page social row.
- `instagram-graph.ts` + `get-gallery-items.ts` + `GalleryGrid.tsx`; `/gallery` is async, `revalidate = 3600`.
- `GET` fallback: `gallery-fallback.ts` (Unsplash placeholders) when API keys missing.
- `POST /api/revalidate-gallery?secret=` for Coolify cron (optional).
- `web/.env.example` documents `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, `REVALIDATE_SECRET`.
- `DEPLOY.md` — new “Instagram gallery” section.

### Verify
- `npm run build` — OK (includes `/api/revalidate-gallery`).

---

## 2026-04-07 — Owner presentation / demo polish (no Meta API yet)

### Goal
- Convincing walkthrough for Ethan before FB/IG business access; honest about placeholders where needed.

### Added / updated
- `demo-content.ts` — hero copy, “why choose us,” sample testimonials (replace before public launch).
- `BrandWordmark` (TCK monogram + stacked wordmark) in `Header`.
- Home: `StatsStrip`, `WhyChooseSection`, `TestimonialsSection`, `CtaBand` between hero and `HomeHighlights`.
- Stronger hero image + copy; refined `HomeHighlights`, `Contact`, `About`, gallery page blurbs.
- `siteConfig.presentationMode` + `serviceArea`; footer line toggles presentation vs launch.
- Removed `as const` from `siteConfig` so `presentationMode` can be flipped to `false` later.

---

## 2026-04-07 — Local demo images (`public/demo/`)

- Downloaded Unsplash kitchen photos to `web/public/demo/` (`hero-kitchen.jpg`, `gallery-01.jpg`–`03.jpg`).
- `HeroSection` + `gallery-fallback.ts` now use `/demo/...` paths (no remote Unsplash fetch).
- `public/demo/ATTRIBUTION.txt` — Unsplash license + photo IDs.
- Removed `images.unsplash.com` from `next.config.mjs` remotePatterns.

---

## 2026-04-07 — “Exact” logo / phone / email from Meta (reality + plumbing)

### Reality
- Facebook and Instagram **block** unauthenticated HTML/API access from this environment (login wall, HTTP 400 to curl). **No phone, email, or logo URL could be extracted automatically.**

### What we shipped instead
- **`site-config.ts`** reads **`NEXT_PUBLIC_TCK_*`** and **`NEXT_PUBLIC_SITE_URL`** from env (defaults unchanged until `.env.local` is filled).
- **`LogoOrWordmark`** (client): tries `/brand/logo.png|jpg|jpeg|webp`, else TCK wordmark. **`public/brand/README.txt`** explains saving the FB/IG profile image manually.
- **Contact + footer** show optional **`NEXT_PUBLIC_TCK_STREET_ADDRESS`** and **`NEXT_PUBLIC_TCK_HOURS`**.
- **`.env.example`** expanded with all public business keys + Instagram server keys.
- **`DEPLOY.md`** — Coolify env + logo file note.

---

## 2026-04-07 — Official logo file in repo

- Copied owner-provided PNG to `web/public/brand/logo.png` (~37KB).
- Header `LogoOrWordmark` loads it automatically (no Meta fetch needed).

---

## 2026-04-05 — Instagram login: real grid assets + Barrie defaults

### Context
- User logged into Instagram in the Cursor browser so the profile grid could load.
- Network tab captured `scontent-*.cdninstagram.com` URLs for posts (not profile thumbnails only).

### Changes
- Downloaded seven JPEGs to `web/public/social/` (`hero-ig.jpg`, `ig-01.jpg`–`ig-06.jpg`) via `Invoke-WebRequest` from those CDN URLs.
- `public/social/ATTRIBUTION.txt` — source note (Meta CDN, date, purpose).
- **`gallery-fallback.ts`** — six fallbacks now point at `/social/ig-*.jpg` (Graph API still overrides when configured).
- **`HeroSection.tsx`** — hero uses `/social/hero-ig.jpg`.
- **`site-config.ts`** — defaults: Barrie showroom (`438 Dunlop St W`, `L4N 1C2`), Ontario, service-area line aligned with IG bio; added **`postalCode`** + **`NEXT_PUBLIC_TCK_POSTAL`**.
- **`Footer.tsx`**, **`ContactSection.tsx`** — render postal after city/region.
- **`.env.example`** — sample values for city/region/street/postal.

### Verify
- `npm run build` in `web/`
- `npm run dev` → home hero + `/gallery` show local IG-sourced images without API keys.

---

## 2026-04-05 — Meta profile snapshot + real phone / email defaults

### Captured (logged-in browser)
- **Instagram:** bio lines, address, 84 posts / 661 followers, highlights Fireplaces & Reviews ⭐️.
- **Facebook:** phone **(705) 309-4443**, **totalconceptkitchens@gmail.com**, 58 followers, 1 review (reviewer name visible), check-ins (Barrie, Lake Dalrymple, Kushog Lake, Elmvale, Springwater), post seed “Project Dalrymple Lodge”.

### Saved in repo
- **`web/content/META_PROFILE_SNAPSHOT.md`** — human-readable reference for copy and SEO.
- **`web/content/business-profile-source.json`** — structured fields for tooling.

### Site wiring
- **`site-config.ts`** — default `phoneDisplay`, `phoneTel`, and `email` now match Facebook (still overridable via env).
- **`.env.example`** — filled with the same contact values.

---

## 2026-04-05 — Gallery: Instagram captions + API caption field

### What
- Opened Instagram posts from the profile grid and captured **post descriptions** (headings / caption text in the modal).

### Code
- **`GalleryItem`** — optional **`caption`** (visible under the image); **`alt`** stays short for a11y.
- **`GalleryGrid`** — shows caption below each tile; fallback **Links** use **`item.href`** when set (permalink to the post), not only the profile URL.
- **`gallery-fallback.ts`** — each local `/social/ig-*.jpg` has `alt`, `caption` from IG, and `https://www.instagram.com/p/…/` link.
- **`instagram-graph.ts`** — API items get **`caption`** (trimmed to 280 chars for UI) plus shorter **`alt`**.
- **`HeroSection`** — hero `alt` reflects the “Showstopper” kitchen description.
- **`business-profile-source.json`** — `instagramPostCaptions` array; **`META_PROFILE_SNAPSHOT.md`** — caption section; **`ATTRIBUTION.txt`** — note about captions.

### Verify
- `npm run build` in `web/`; open `/gallery` — captions appear under photos; clicking opens the matching post.

---

## 2026-04-05 — No duplicate gallery / hero images

- Verified **SHA256**: `hero-ig.jpg` ≠ each of `ig-01` … `ig-06` (seven unique files on disk).
- **`gallery-dedupe.ts`** — `dedupeGalleryItemsBySrc()` collapses tiles that share the same image URL path (ignores query string), used when serving Instagram API results.
- **`gallery-fallback.ts`** — throws if any two fallback rows share the same `src`; exports `fallbackGalleryImageSrcs` for the hero guard.
- **`HeroSection`** — throws if `HERO_IMAGE` matches any fallback gallery path.
- **`get-gallery-items`** — fetches up to 18 Instagram rows, dedupes, then **`slice(0, 12)`** so the grid stays full when Meta returns the same `media_url` more than once.

---

## 2026-04-05 — Mise chatbot + biz portal + 500+ FAQ bank

### Bot brand
- **Mise** — play on *mise en place* (everything in its place). Tagline: *Your Total Concept Kitchens co-pilot*. Warm, light kitchen wordplay, still professional.

### FAQ / knowledge
- **`scripts/generate-mise-faq.mjs`**: regenerates **`src/data/mise-faq.json`** (534+ Q&A rows). Runs on **`npm run build`** via `prebuild`.
- **`/api/chat`**: token-overlap match against the bank; optional **`OPENAI_API_KEY`** (and `OPENAI_CHAT_MODEL`, default `gpt-4o-mini`) for answers when no FAQ hit; otherwise friendly fallback to contact Ethan.

### Portal (Ethan)
- **`/portal`**: password login (`TCK_PORTAL_PASSWORD` + `TCK_PORTAL_SECRET` for signed cookie). Edits **`content/portal-settings.json`**: announcement banner, Mise greeting, Mise footer note.
- **Footer** link: *Staff portal*. Portal layout **`robots: noindex`**.
- **Persistence**: Node `fs` on the server — for Docker/Coolify, mount `content/` writable or sync `portal-settings.json` from deploy.

### UI
- **`MiseChatWidget`**: floating “Ask Mise” on all pages (root layout).
- **`SiteAnnouncement`**: optional top banner from portal settings.

### Env (see `web/.env.example`)
- `TCK_PORTAL_SECRET`, `TCK_PORTAL_PASSWORD`, optional `OPENAI_API_KEY`, `OPENAI_CHAT_MODEL`.

### Verify
- Set env → `npm run dev` → open site → chat widget → `/portal` login → save banner → reload home.

---

## 2026-04-05 — Full-site copy audit (professional contractor tone)

### Compared to typical high-end kitchen / remodel sites
- Short, confident sentences; active voice; scope and process spelled out without jargon dumps.
- No “demo” or staging language on the public UI; testimonials framed honestly when quotes are still placeholders.
- Service area and contact paths clear; CTAs direct (“Learn more”, “Book a consultation”).

### Copy and structure updates
- **`demo-content.ts`**, **`WhyChooseSection`**, **`StatsStrip`**, **`ServicesSection`**, **`ProcessSection`**, **`HeroSection` (alt text)** — tightened hero and differentiators; renamed strip item to **Fit & finish**; reduced negative phrasing (“you’re not chasing…”).
- **`ContactSection`** + **`contact/page.tsx`** — removed “automated funnel”; clearer channel hints; **Owner** title capitalized; button **Email us to book a consult**.
- **`about/page.tsx`** — calmer intro line; less flippant than “parade of subs”; bullet list more professional; article background **cream** to match other inner pages.
- **`gallery/page.tsx`**, **`GalleryGrid`** — shorter headers; fallback section title **Project gallery**; no awkward “when linked” wording.
- **`HomeHighlights`**, **`CtaBand`**, **`not-found`**, **`TestimonialsSection`** — “Learn more”; CTA band without “no-pressure / Pinterest”; 404 friendlier; testimonials **Client feedback** + subtitle that does not imply every quote is verified yet.
- **`services` / `process` metadata & headers**, **`site-config.ts` default tagline** — cleaner SEO descriptions.

### Verify
- `cd web && npm run build` — OK.

---

## 2026-04-05 — Site-wide consistency + client-facing copy (browser checked)

### Browser / dev
- IDE browser reviewed **Contact**, **Services**, and **Gallery** on a fresh `next build` + `next start` (port **3012**).
- Long-running `next dev` had a **corrupt `.next`** (`Cannot find module './948.js'`, static chunks 404). Fix: **delete `web/.next`** and restart dev (or rely on a clean `npm run build`).

### Visual / UX alignment
- **`PageHeader`:** Shared vertical rhythm (`py-12` → `lg:py-20`) and relaxed body line-height so inner pages match section spacing.
- **`ContactSection`:** Section `h2` and `py-20` aligned with Services/Process; contact cards use same **bronze icon tiles** and **white elevated cards** as Services / home highlights; **`min-w-0`** + **`overflow-wrap:anywhere`** on email link to avoid ugly mid-word breaks in grid cells.
- **`CtaBand`:** Heading scale matches other section `h2`s (`text-3xl sm:text-4xl`).

### Remove “staging” language from the public UI
- **`HomeHighlights`:** Removed Coolify/Docker/Cloudflare note; gallery blurb is client-facing.
- **`TestimonialsSection`:** Removed presentation-mode “sample quotes” disclaimer; neutral subtitle instead.
- **`Footer`:** Copyright is always **© … All rights reserved.**
- **`gallery/page.tsx` + `GalleryGrid`:** Page intro and grid blurb no longer mention Graph API, `public/social/`, or `.env.example`.

---

## 2026-04-05 — Contact page: professional layout

### Problem
- Contact page showed developer-facing copy (`.env.local` / `.env.example`) and a single centered dark block that felt informal compared to other marketing pages.

### Changes
- **`ContactSection.tsx`:** Cream/light section aligned with Services; removed env notes; added **Phone / Email / Location** cards (Lucide icons); clear CTAs; service area + hours or “by appointment”; social block as a subdued footer strip.
- **`contact/page.tsx`:** Page title **Contact us**; metadata and intro line tightened.

### Verify
- Open `/contact` — no implementation notes; scannable contact methods and primary buttons.

---

## 2026-04-05 — Header logo: transparent PNG + larger display

### Problem
- `public/brand/logo.png` had a solid white background and looked like a small white tile on the cream header.

### Changes
- **Asset:** Processed `logo.png` in place (Pillow flood-fill from corners + trim excess padding + light transparent margin) so the background is alpha-transparent.
- **`LogoOrWordmark.tsx`:** Larger logo in the header (`h-12` / `sm:h-14`, higher `max-w`) and `width`/`height` updated to match the trimmed asset aspect ratio.
- **`public/brand/README.txt`:** Note to use transparent PNGs when replacing the file.

### Verify
- `npm run dev` → header logo fills more of the bar and shows no white box around the mark.

---

## 2026-04-05 — Full site smoke test + gallery `Image` layout

### Testing
- **HTTP:** `Invoke-WebRequest` (or `curl`) against `http://localhost:3011` — `/`, `/services`, `/process`, `/gallery`, `/contact`, `/about` return **200**; unknown path returns **404**; `GET /api/revalidate-gallery` without secret returns **401** (expected).
- **Browser:** Home, Services, Process, Gallery, Contact, About — layout and nav consistent; gallery tiles show real images after fix below.
- **404:** `curl` confirms **404** for bogus paths; embedded IDE browser sometimes showed a generic “invalid response” for a bad URL — treat **curl/HTTP** as source of truth if the in-IDE browser misbehaves.

### Problem (gallery)
- `next/image` with **`fill`** requires a **positioned** ancestor. The grid used a static wrapper in some revisions, which produced grey tiles and console errors (`position: static` parent).

### Fix (`GalleryGrid.tsx`)
- Wrap each tile image in a **`relative aspect-[4/5]`** container so `fill` resolves correctly; keep **`Link` / `<a>`** as **`relative block h-full w-full`** where they wrap the image.
- **`priority={index === 0}`** on the first fallback **`Image`** to reduce LCP warnings for the first visible tile.

### Verify
- `cd web && npm run build` — OK after changes.
- `npm run dev` → open **http://localhost:3011/gallery** — photos visible, no `fill`/position errors in devtools.

---

## 2026-04-05 — Local port 3012 + clean rebuild (stale `.next` / missing Mise)

### Problem
- User runs **http://localhost:3012** while `npm run dev` defaulted to **3011**, or an old **`next start`** on 3012 served a **pre-feature** `.next` bundle (no Mise, old footer copy).

### Changes
- **`web/package.json`:** `dev` / `start` now use **port 3012**. Added **`clean`** (`scripts/clean-next.mjs` removes `.next`), **`dev:clean`**, **`start:clean`** (clean → build → start).
- **`web/src/lib/site-config.ts`**, **`web/.env.example`:** default `NEXT_PUBLIC_SITE_URL` → `http://localhost:3012`.
- **Root `package.json`**, **`web/README.md`**, **`DEPLOY.md`:** docs updated for 3012 (Docker host port mapping example).

### Verify
- Stop any old Node on 3012. From `web/`: `npm run dev:clean` **or** `npm run start:clean` — open **http://localhost:3012** and confirm **Ask Mise** + **Staff portal** in footer.

---

## 2026-04-07 — “Site destroyed” / unstyled pages (CSS 400)

### What happened
- **`/_next/static/css/*.css` and JS chunks returned HTTP 400** while the HTML still referenced **older** hashed filenames (e.g. `5262bf15d948d7ba.css` on disk was gone after a new build; current file was `81e2edfeaa94bdd9.css`).
- **Cause:** A **`next start` process kept running** after **`npm run build`** replaced `.next` on disk — stale HTML vs new (or missing) static assets. Tailwind never loaded, so the page looked like a broken wall of image + plain text.
- **`output: "standalone"`:** Next.js warns that **`next start` is not supported** with standalone; that combination can add confusion for local prod tests.

### Fixes
- **`web/scripts/sync-standalone-assets.mjs` + `postbuild`:** Copy `.next/static` and `public` into `.next/standalone/` after each build (same idea as the Dockerfile).
- **`web/scripts/start-prod.mjs` + `npm start`:** Run **`node .next/standalone/server.js`** with `PORT=3012` instead of `next start`.
- **`web/README.md`:** Note to **restart the server after every rebuild**; use `npm run start:clean` when in doubt.

### Verify
- `npm run build` then `npm start` — `Invoke-WebRequest` home page, extract `/_next/static/css/…` from HTML, request that URL → **200**.

---

## 2026-04-07 — “Futuristic” home polish (motion + depth, brand-safe)

### Goal
- More **premium / forward** feel without neon or off-brand gimmicks.

### Changes
- **`Reveal.tsx`:** Framer Motion scroll fade-up; **`useReducedMotion`** skips animation.
- **`HeroAnimatedCopy.tsx` + `HeroSection`:** Staggered hero load; slow **aurora** blobs (`mix-blend-soft-light`) + top specular line; Tailwind keyframes `hero-aurora` / `hero-aurora-slow`.
- **`Header`:** Stronger glass (`backdrop-blur-xl`, `backdrop-saturate-150`), light shadow, bronze gradient hairline under bar.
- **`StatsStrip`, `WhyChooseSection`, `HomeHighlights`, `CtaBand`, `TestimonialsSection`:** `Reveal` with light stagger; subtle grids / hover glows on cards; CTA band grid + drifting glow.
- **`globals.css`:** `::selection` bronze tint; `prefers-reduced-motion` disables smooth scroll on `html`.
- **`tailwind.config.ts`:** Aurora keyframes + animation utilities.

### Verify
- `cd web && npx tsc --noEmit` — OK.
- `npm run dev` → home: hero animates once; scroll sections ease in; enable OS “reduce motion” → no scroll/hover scale animations.

---

## 2026-04-07 — Pro polish pass (ordered): display type, route motion, gallery lightbox, Mise

### 1. Typography
- **`next/font/google`:** `Cormorant_Garamond` → CSS variable `--font-display` on `<body>` with Geist.
- **`globals.css` `@layer base`:** `h1`–`h3` use display serif; body unchanged.
- **`tailwind.config`:** `fontFamily.display` for optional class use.

### 2. Page transitions
- **`app/(site)/template.tsx`:** Client Framer Motion fade/slide on each marketing navigation; skipped when `prefers-reduced-motion`.

### 3. Gallery lightbox
- **`GalleryTiles.tsx`:** Client grid; tap to enlarge; **Escape**, **←/→**, backdrop click, close button; caption + optional Instagram link; `next/image` for fallback tiles, `<img>` for Instagram CDN; body scroll lock while open.
- **`GalleryGrid.tsx`:** Server shell + copy; delegates grid to `GalleryTiles`.

### 4. Mise
- **Typing indicator:** Three bronze dots + `aria-live` / `role="status"`.
- **Panel + bubbles:** Entry motion; `tailwind` keyframe `mise-dot` for the typing animation.

### Deferred
- **Hero video:** Not added — needs a real compressed asset + hosting choice; can wire later with an env URL + `<video poster={hero} muted loop playsInline>`.

### Verify
- `cd web && npx tsc --noEmit && npx next lint` — OK.
- Dev: navigate Services ↔ Gallery ↔ Home (subtle transition); Gallery: open lightbox, arrows, Esc; Mise: send message → dots → reply animation.

---

## 2026-04-07 — Gallery (and hero) blank: missing `public/social/` JPEGs

### Cause
- Fallback gallery paths (`/social/ig-01.jpg` … `ig-06.jpg`) and hero `/social/hero-ig.jpg` were **not present** in the workspace (only `ATTRIBUTION.txt` under `public/social/`). Requests returned **404**, so tiles looked empty.

### Changes
- **`gallery-local-files.ts`:** `filterToExistingPublicFiles()` — only serve fallback rows whose files exist.
- **`get-gallery-items.ts`:** If Instagram returns nothing usable, use file-backed fallback; if **no files**, use **`remotePlaceholderGalleryItems`** (Unsplash) and set `usingRemotePlaceholders: true`. If Instagram dedupes to empty, fall through to the same chain.
- **`gallery-fallback-remote.ts`:** Six licensed Unsplash kitchen URLs + honest captions.
- **`next.config.mjs`:** `images.remotePatterns` for `images.unsplash.com`.
- **`GalleryGrid`:** Amber notice when remote placeholders are active.
- **`HeroSection`:** Async server component — uses local `hero-ig.jpg` when present, else same Unsplash hero as temporary stand-in.
- **`page.tsx` (home):** `async` for `HeroSection`.
- **`ATTRIBUTION.txt`:** Note about missing files → remote fallback.

### Verify
- With no local JPEGs: `/gallery` shows six images + banner; home hero shows image.
- After adding `public/social/ig-01.jpg`…`ig-06.jpg` and `hero-ig.jpg`, site switches to real assets automatically.

---

## 2026-04-07 — Browser audit: logo, hero, blank main (Framer SSR)

### Findings (localhost)
- **Logo:** Client `LogoOrWordmark` tried `logo.png` first; missing file → broken icon; `onError` chain unreliable. **Fix:** server-side `fs.existsSync` under `public/brand/` → raster or SVG, else **`BrandWordmark`**.
- **Remote hero / Unsplash gallery:** `next/image` for external URLs can fail in some dev setups. **Fix:** plain `<img>` when hero uses remote URL; gallery tiles/lightbox use `<img>` for `https://` fallback `src`.
- **Blank cream main:** `(site)/template.tsx`, **`Reveal`**, and **`HeroAnimatedCopy`** used **`opacity: 0` in `initial` / SSR**. Framer painted invisible content until hydration — embedded browser showed empty body. **Fix:** keep **`opacity: 1`** for first paint; animate **y** only where motion remains.
- **Stale server:** Old `next start` / dev process served outdated bundles — restarted **`npm run dev`** on 3012 while testing.

### Verify
- `npx tsc --noEmit && npx next lint` — OK.
- Browser: home hero + copy visible; `/gallery` tiles + captions; header logo or TCK wordmark.

---

## 2026-04-05 — Staff portal env (`TCK_PORTAL_SECRET`, `TCK_PORTAL_PASSWORD`)

### Problem
- `/portal` showed “Portal not configured” when `TCK_PORTAL_SECRET` or `TCK_PORTAL_PASSWORD` was missing (see `web/src/app/api/portal/login/route.ts`).

### Changes
- Added **`web/.env.local`** (gitignored): `TCK_PORTAL_SECRET` = random 32-byte hex; `TCK_PORTAL_PASSWORD` = placeholder **`CHANGE_ME_TO_STRONG_PASSWORD`** — user must replace before relying on it.

### Verify
- Edit `web/.env.local`: set a real `TCK_PORTAL_PASSWORD`.
- From repo root: `npm run dev` (Next on **3012**).
- Open **http://localhost:3012/portal**, sign in with that password; settings should load/save to `web/content/portal-settings.json`.
- **Production (Coolify/Docker):** set the same two variables in the host environment (not only on the dev machine).

---

## 2026-04-07 — Home hero: welcome line + kitchen fallback image

### Changes
- **`HeroAnimatedCopy`:** “Welcome to” + **`siteConfig.name`** above the existing eyebrow/headline (reduced-motion + animated paths).
- **`HeroSection`:** Remote hero Unsplash swap from `photo-1556911220…` (read as non-kitchen) to **`photo-1556909114…`** (clear kitchen island/cabinetry).
- **`gallery-fallback-remote.ts`:** First placeholder tile uses the same kitchen image for consistency.

### Verify
- `npm run dev` → home hero shows welcome + company name; background reads as kitchen when `hero-ig.jpg` absent.

---

## 2026-04-07 — Home hero: stop using `hero-ig.jpg` (wrong room); prioritize real kitchen assets

### Cause
- **`public/social/hero-ig.jpg`** was still chosen whenever present; it read as a bathroom to stakeholders, not a kitchen.

### Changes
- **`HeroSection`:** Resolve hero as **`/demo/hero-kitchen.jpg`** → else **`/social/ig-01.jpg`** → else Unsplash **`photo-1600607687939…`** (minimal kitchen + island). **`hero-ig.jpg` is no longer used** for the hero.
- Removed the old “hero path must not match gallery fallback list” guard (hero may reuse `ig-01` — acceptable).
- **`ATTRIBUTION.txt`:** Documents the new order; notes `hero-ig.jpg` is unused by hero.
- **`gallery-fallback-remote.ts`:** Second placeholder uses a distinct kitchen Unsplash so tiles are not duplicates.

### Verify
- Superseded: hero now uses **Ethan’s `ig-*` order only** (see next log entry).

---

## 2026-04-07 — Vitest unit tests (lib only)

### Why Vitest (not Playwright first)
- Fast CI-friendly checks on **pure helpers** without browser infra. E2E can be added later if needed.

### Changes
- **`vitest`**, **`vitest.config.ts`** (`@` alias, `src/**/*.test.ts`).
- **`gallery-dedupe.test.ts`:** `mediaKeyForSrc`, `dedupeGalleryItemsBySrc`.
- **`utils.test.ts`:** `cn` / tailwind-merge behavior.
- **`package.json`:** `test` / `test:watch`; root **`test`** delegates to `web`.

### Verify
- `cd web && npm run test` — 7 tests.  
- `npm run test` from repo root.

---

## 2026-04-07 — Portal: 10 owner-facing controls

### Features (Ethan)
1. Site-wide **announcement banner**  
2. **Mise** greeting + footer note  
3–6. **Home hero** eyebrow, headline, supporting paragraph, trust line  
7. **Hours** line (footer + overrides env when set)  
8. **Reviews URL** → “Leave us a review” in footer  
9. **Contact page** subtitle + optional highlight note above cards  
10. **Footer tagline** + **private notes** (portal-only, never on public site)

### Code
- **`PortalSettings`** extended in `mise-types.ts`; **`portal-defaults.ts`** (client-safe); **`portal-mutable-keys.ts`** for API merge.
- **`portal-settings.ts`** merge/save; **`HeroSection`**, async **`Footer`**, **`ContactPage`** + **`ContactSection`** read overrides.
- **`PortalClient`** grouped UI; **`(site)/layout`** + **`not-found`** async for async `Footer`.
- **`content/portal-settings.json`** full schema with nulls.

### Verify
- Sign in `/portal`, edit fields, Save — confirm home/contact/footer update. Private notes never appear on marketing pages.

---

## 2026-04-07 — Contact page: email on one line

### Changes
- **`ContactSection`:** Removed `[overflow-wrap:anywhere]` (was breaking the address mid-string). Email link uses **`whitespace-nowrap`** inside a **`overflow-x-auto`** wrapper so the full address stays one line; tiny screens can scroll horizontally in the card.

---

## 2026-04-07 — Local vs live look: lock light page shell

### Cause
- `globals.css` used `@media (prefers-color-scheme: dark)` to set `--background` / `--foreground` on **`:root`**, so the **whole body** went near-black on Windows dark mode while many blocks still used light cream / mixed `dark:` utilities → muddy local preview. Phones or light-mode browsers often showed the intended cream shell (“live looks more impressive”).

### Changes
- Removed that `:root` dark override; set **`html { color-scheme: light; }`** so the default shell matches the brand. Per-component **`dark:`** classes unchanged.

---

## 2026-04-07 — SEO: sitemap, robots, canonicals (skills: seo-fundamentals)

### Changes
- **`app/sitemap.ts`:** Marketing URLs from `siteConfig.url` + priorities / changeFrequency.
- **`app/robots.ts`:** `allow /`, `disallow /portal`, `/api/`, `sitemap` URL.
- **`lib/page-metadata.ts`:** `marketingPageMeta(path)` → `alternates.canonical` (avoids clobbering root `openGraph`).
- **Home + inner pages:** Spread `marketingPageMeta` into each `metadata` export.
- **`SKILLS_REFERENCE.md`:** TCK called out; high-value skills listed for web/SEO/perf.

### Verify
- `npm run build` → `/sitemap.xml`, `/robots.txt` generated.
- Production: `NEXT_PUBLIC_SITE_URL` must be the live origin so sitemap/robots/canonicals are correct.

---

## 2026-04-07 — Pro polish (all marketing pages)

### Added
- **`SkipLink`:** “Skip to main content” — keyboard / SR bypass (WCAG); on 404 too.
- **`SiteJsonLd`:** `LocalBusiness` + `WebSite` structured data from `siteConfig` (NAP, sameAs, area served).
- **`Breadcrumbs`:** Home + path (hidden on `/`); `aria-label`, `aria-current` on current page.
- **`ScrollToTop`:** After ~400px scroll, **bottom-left** (avoids Mise bottom-right); respects reduced motion.
- **`PageHeader`:** Bronze left rule + display font on inner-page H1s.
- **`main id="main-content"`** on all `(site)` pages + `not-found`.

### Verify
- Tab from load: skip link appears; Enter → focus lands in main.
- Rich Results Test / View Source: JSON-LD script present.
- Inner route: breadcrumb matches URL; scroll long page → back-to-top.

---

## 2026-04-07 — Header height: room for logo ring / glow

### Changes
- **`Header`:** Main row **`h-16` → `min-h-[5.5rem] py-3` / `sm:min-h-[6rem] sm:py-3.5`** so the mark, ring-offset, and pulse shadow sit inside the frosted bar instead of bleeding over the hero. Mobile sub-nav **`py-2.5`**.

---

## 2026-04-07 — Hero welcome band + logo emphasis + header polish

### Changes
- **`HeroAnimatedCopy`:** “Welcome to” + company name live in a **rounded frosted card**; main story (eyebrow, H1, body, trust line) sits in a **bronze left rule** block. Company line slightly smaller; headline scales to **`xl:text-7xl`**. Inner motion stagger for the main block.
- **`tailwind.config`:** `logo-emphasis` keyframes — soft scale + bronze **drop-shadow** pulse (~3.8s).
- **`LogoOrWordmark` / `BrandWordmark`:** Bronze **ring + ring-offset**; **`motion-safe:animate-logo-emphasis`** on mark ( **`motion-reduce:animate-none`** ).
- **`Header`:** Nav links get subtle **hover pill**; **Book consult** slightly bolder + ring on hover.

### Verify
- `npm run dev` — hero reads in two bands; logo breathes gently; reduced motion disables logo pulse.

---

## 2026-04-07 — Home hero: Ethan’s `ig-*.jpg` only (cabinetry-first)

### Changes
- **`HeroSection`:** Hero background is **only** from `public/social/ig-01.jpg`…`ig-06.jpg`, in order **ig-05 → ig-06 → ig-02 → ig-01 → ig-04 → ig-03** (reeded cabinet wall and reface first). No demo Unsplash file for hero. Alts pulled from **`gallery-fallback.ts`**. Unsplash remains only if no `ig-*` files exist in the build.
- **`ATTRIBUTION.txt`:** Updated hero description.

### Verify
- With `ig-05.jpg` present, home hero matches that cabinetry shot; gallery may show the same image again on `/gallery` (acceptable).

---

## 2026-04-05 — GitHub: first push (`mexemexe02/total-concept-kitchens`)

### Problem
- Root `git init` had staged **`web`** as an embedded repo (nested `web/.git`). **`git rm --cached -f web`** after removing **`web/.git`** fixed the index so **`web/`** files commit as normal paths.

### Other
- **`git config --global safe.directory`** added for `V:/Cursor_Projects/Websites/cursor Total_Concept_Kitchens` (dubious ownership: `.git` owned by Administrators vs current user).

### Remote
- **https://github.com/mexemexe02/total-concept-kitchens.git** — branch **`main`**, initial commit **`8f20552`**. **`web/.env.local`** not in repo (gitignored).

### Verify
- Open repo on GitHub; Coolify: source **mexemexe02/total-concept-kitchens**, build context **`web`**.
