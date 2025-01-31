import { sentryVitePlugin } from "@sentry/vite-plugin";
import envCompatible from "vite-plugin-env-compatible";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild, command }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./server/app.ts",
        }
      : undefined,
    sourcemap: false,
  },
  ssr: {
    noExternal: command === "build" ? true : undefined,
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    envCompatible(),
    sentryVitePlugin({
      org: "craigs-org",
      project: "codeboard",
    }),
  ],
}));
