import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';

export default defineConfig({
  plugins: [react(), ],
  assetsInclude: ['**/*.glb'],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        sw: "./sw.js",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "credentialless",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
});
