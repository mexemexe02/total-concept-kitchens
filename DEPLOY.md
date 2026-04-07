# Deploy: Coolify + Cloudflare (no Vercel)

This app is a **Next.js 14** project under `web/`. Production runs as a **Docker** container using Next **`standalone`** output.

## Coolify

1. Create a new resource → **Dockerfile** (or Git-based build with Dockerfile).
2. **Repository**: your Git repo.
3. **Base directory / build context**: `web` (important: the folder that contains `Dockerfile` and `package.json`).
4. **Dockerfile location**: `web/Dockerfile` (or `Dockerfile` if context is already `web/`).
5. **Port**: expose **3000** (the container listens on `PORT`, default 3000).
6. Add **environment variables** in Coolify as needed — **`web/.env.example`** lists:
   - **`NEXT_PUBLIC_TCK_*`** — phone, email, address, hours (paste from Facebook Page → About; Meta blocks scrapers).
   - **Instagram API** vars for the gallery (below).

7. **Logo:** add `web/public/brand/logo.png` (Ethan’s page/profile image from [Facebook](https://www.facebook.com/p/Total-Concept-Kitchens-100031038951078/) or [Instagram](https://www.instagram.com/totalconceptkitchens/) — save manually; see `public/brand/README.txt`).

Coolify handles TLS on the origin or you can terminate TLS only at Cloudflare (see below).

## Instagram gallery (auto-updating)

Scraping Facebook/Instagram HTML is fragile and violates Meta’s terms. This app uses the **Instagram Graph API** so Ethan’s posts can appear on `/gallery` after a refresh.

1. Convert or confirm the Instagram account is **Business** or **Creator** and **linked to a Facebook Page** you manage.
2. Create a **Meta app** at [developers.facebook.com](https://developers.facebook.com/) and add the **Instagram** product / permissions needed to read the account’s media (see [Instagram API docs](https://developers.facebook.com/docs/instagram-api)).
3. Generate a **long-lived access token** and find the **Instagram User ID** (Graph API Explorer: your Page → `instagram_business_account`).
4. In Coolify, set:
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_USER_ID`
5. Optional: set `REVALIDATE_SECRET` and add a **scheduled request** every 15–60 minutes:  
   `GET` or `POST https://YOUR-DOMAIN/api/revalidate-gallery?secret=REVALIDATE_SECRET`  
   so new posts show up without waiting for the route’s default ISR window.

The `/gallery` route uses `revalidate = 3600` (hourly) as a baseline. Without API vars, the site shows placeholder images and still links to your real [Facebook](https://www.facebook.com/p/Total-Concept-Kitchens-100031038951078/) and [Instagram](https://www.instagram.com/totalconceptkitchens/) profiles.

## Cloudflare (typical setup)

- **DNS**: Point your domain (A/AAAA or CNAME) to the server Coolify uses, or use a **Cloudflare Tunnel** if the host has no public ports.
- **Proxy (orange cloud)**: SSL/TLS mode **Full (strict)** if Coolify serves HTTPS, or **Full** if the origin is HTTP only (less ideal).
- **Caching**: For dynamic Next.js pages, avoid aggressive cache rules on HTML; static assets under `/_next/static/` can be cached long-term.

This stack is **Coolify on your server** + **Cloudflare in front** for DNS, WAF, and CDN-style features—not Cloudflare Pages as the Node host.

## Local Docker check

From repo root (Docker installed):

```bash
docker build -t tck-web ./web
docker run --rm -p 3012:3000 tck-web
```

Open `http://localhost:3012` (host 3012 → container 3000).

## Dev server (this repo)

From root: `npm run dev` → **http://localhost:3012** (see `web/package.json`).
