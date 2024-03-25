import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        index: "./src/main.ts",
      },
      output: {
        format: "umd",
        chunkFileNames: `[name].[hash].js`,
        entryFileNames: "robot-log-enhancer.umd.js",
        dir: "dist",
      },
    },
  },
});
