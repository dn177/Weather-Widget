import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
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
    // Data-integrity tests run in node; switch to jsdom per-file when
    // component tests arrive (see CODE-REVIEW.md roadmap #7).
    environment: "node",
  },
});
