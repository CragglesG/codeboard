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
      "/boards",
      "/signin",
      "/signup",
      "/newscribble",
      "/newboard",
    ];
  },
  presets: [vercelPreset()],
} satisfies Config;
