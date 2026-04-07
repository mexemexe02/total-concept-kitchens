This is a [Next.js](https://nextjs.org) app in the `web/` directory.

## Getting started

From the **repository root**:

```bash
npm run dev
```

Or from `web/`:

```bash
npm run dev
```

Open [http://localhost:3012](http://localhost:3012) (port chosen to avoid 3000–3010).

### Production build locally

After `npm run build`, run `npm start` (uses the **standalone** server on port 3012). **Restart the server whenever you rebuild** — an old process can keep serving HTML that points at removed CSS/JS files, which breaks styling. For a clean run: `npm run start:clean`.

### Routes (multi-page, same as production)

| Path | File |
|------|------|
| `/` | `src/app/(site)/page.tsx` |
| `/services` | `src/app/(site)/services/page.tsx` |
| `/process` | `src/app/(site)/process/page.tsx` |
| `/gallery` | `src/app/(site)/gallery/page.tsx` |
| `/contact` | `src/app/(site)/contact/page.tsx` |
| `/about` | `src/app/(site)/about/page.tsx` |

Shared header/footer: `src/app/(site)/layout.tsx`. Section UI lives in `src/components/site/`.

## Fonts

This project uses [`next/font/local`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with Geist font files under `src/app/fonts/`.

## Deploy

Self-hosted deployment (Coolify, Docker, Cloudflare in front) is documented in the repo root **[DEPLOY.md](../DEPLOY.md)**. This project does **not** assume Vercel.

## More

- [Next.js documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
