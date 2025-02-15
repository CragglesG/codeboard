import envCompatible from "vite-plugin-env-compatible";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import babel from "vite-plugin-babel";

const ReactCompilerConfig = {
  target: "19",
};

export default defineConfig(({ command }) => ({
  build: {
    sourcemap: false,
  },
  ssr: {
    noExternal: command === "build" ? true : undefined,
  },
  plugins: [
    reactRouter(),
    envCompatible(),
    tsconfigPaths(),
    tailwindcss(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
}));
