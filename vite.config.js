import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "/yash-portfolio/",
  publicDir: "public",
  build: {
    outDir: "dist",
  },
  server: {
    port: 3002,
    open: true,
  },
});
