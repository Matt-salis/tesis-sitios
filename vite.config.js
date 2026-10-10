import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        osde: resolve(root, "index.html"),
        tienda: resolve(root, "tienda.html"),
        portfolio: resolve(root, "portfolio.html"),
      },
    },
  },
});
