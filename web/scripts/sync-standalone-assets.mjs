/**
 * After `next build` with `output: "standalone"`, Next puts server code in
 * `.next/standalone/` but does **not** copy `.next/static` or `public` there.
 * Docker does this in the Dockerfile; locally we mirror that so
 * `node .next/standalone/server.js` can serve CSS/JS (avoids broken / unstyled pages).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");
const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(standalone, ".next", "static");
const publicSrc = path.join(root, "public");
const publicDest = path.join(standalone, "public");

if (!fs.existsSync(standalone)) {
  console.warn("sync-standalone-assets: no .next/standalone — skip (run npm run build first).");
  process.exit(0);
}

if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.dirname(staticDest), { recursive: true });
  fs.cpSync(staticSrc, staticDest, { recursive: true });
  console.log("sync-standalone-assets: copied .next/static → standalone/.next/static");
} else {
  console.warn("sync-standalone-assets: missing .next/static");
}

if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
  console.log("sync-standalone-assets: copied public → standalone/public");
}
