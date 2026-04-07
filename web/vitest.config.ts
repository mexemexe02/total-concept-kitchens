import path from "path";
import { defineConfig } from "vitest/config";

/**
 * Unit tests for pure `src/lib` helpers — no jsdom unless a test file needs it.
 * `@/*` matches Next/tsconfig so imports inside modules resolve.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
