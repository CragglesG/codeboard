import { sentryVitePlugin } from "@sentry/vite-plugin";
// vite.config.js
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [
    reactRouter(),
    envCompatible(),
    sentryVitePlugin({
      org: "craigs-org",
      project: "codeboard",
    }),
  ],
  build: {
    sourcemap: false,
  },
});
