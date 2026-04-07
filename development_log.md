# Development log — Total Concept Kitchens

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
