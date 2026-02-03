import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [
    process.env.USE_CLOUDFLARE === "true" || command === "build"
      ? cloudflare({ viteEnvironment: { name: "ssr" } })
      : null,
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
}));
