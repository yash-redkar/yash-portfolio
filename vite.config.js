import { defineConfig } from "vite";

export default defineConfig(({ command, mode }) => ({
  root: ".",
  base: mode === "github-pages" ? "/yash-portfolio/" : "/",
  publicDir: "public",
  build: {
    outDir: "dist",
  },
  server: {
    port: 3002,
    open: true,
  },
}));
