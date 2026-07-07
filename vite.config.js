import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // Deployed under the /react subpath of www.cdtio.com. This prefixes every
  // built asset and sets import.meta.env.BASE_URL (used as PUBLIC_URL across
  // the sections) to "/react/". CRA used to derive this from package.json
  // "homepage"; Vite ignores that field, so it lives here instead.
  base: "/react/",
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    // Keep CRA's output directory so existing deploy tooling keeps working.
    outDir: "build",
  },
  test: {
    // Data-integrity tests run in node; component tests opt into jsdom
    // per-file via a "@vitest-environment jsdom" docblock.
    environment: "node",
    // jest-dom matchers + an English i18n test instance + an
    // IntersectionObserver stub (see the file's comments).
    setupFiles: ["./src/test/setup.js"],
  },
});
