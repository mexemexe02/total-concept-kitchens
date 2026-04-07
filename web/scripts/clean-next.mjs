/**
 * Removes `.next` so the next `dev` / `build` cannot serve an outdated bundle
 * (fixes “missing Mise / old footer” when a previous build is still on disk).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");

try {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next");
} catch (e) {
  console.warn("Could not remove .next (may not exist):", e.message);
}
