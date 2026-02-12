import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import packages from "./package.json";

export default defineConfig({
  plugins: [
    tailwindcss(),
    ViteImageOptimizer({
      png: {
        compressionLevel: 9,
        quality: 1,
        palette: true,
      },
    }),
  ],
  define: {
    APP_VER: JSON.stringify(packages.version),
  },
  build: {
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: true,
    brotliSize: true,
  },
});
