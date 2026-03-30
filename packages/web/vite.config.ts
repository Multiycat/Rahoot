import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@rahoot/web": path.resolve(__dirname, "./src"),
      "@rahoot/common": path.resolve(__dirname, "../common/src"),
      "@rahoot/socket": path.resolve(__dirname, "../socket/src"),
    },
  },
  server: {
    port: 8008,
    host: "0.0.0.0",
    proxy: {
      "/ws": {
        target: "https://api.rahoot.multiycat.fr",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  preview: {
    port: 3003,
    host: "0.0.0.0",
  },
});
