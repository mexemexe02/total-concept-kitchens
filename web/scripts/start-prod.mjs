/**
 * Production server on PORT (default 3012) using the standalone bundle.
 * Prefer this over `next start` when `output: "standalone"` is set — Next prints
 * a warning that `next start` is unsupported and asset serving can misbehave.
 */
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverJs = path.join(root, ".next", "standalone", "server.js");

if (!fs.existsSync(serverJs)) {
  console.error("Missing .next/standalone/server.js — run: npm run build");
  process.exit(1);
}

process.env.PORT = process.env.PORT || "3012";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

const child = spawn(process.execPath, [serverJs], {
  stdio: "inherit",
  cwd: root,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
