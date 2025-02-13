import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  appDirectory: "src",
  ssr: true,
  async prerender() {
    return [
      "/",
      "/dashboard",
      "/scribbles",
      "/signin",
      "/signup",
      "/newscribble",
    ];
  },
  presets: [vercelPreset()],
} satisfies Config;
