import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Tests live in the top-level tests/ folder, alongside client/ and server/.
    include: ["tests/**/*.test.js"],
    // In-memory Mongo startup (binary download on first run) can be slow.
    testTimeout: 30000,
    hookTimeout: 120000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Gate only the application logic we actually test.
      include: ["server/controllers/**", "server/services/**"],
      thresholds: {
        lines: 70,
        functions: 70,
        statements: 70,
        branches: 55,
      },
    },
  },
});
