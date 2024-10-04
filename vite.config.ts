import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
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
  css: {
    postcss: './postcss.config.js',
  },
});
