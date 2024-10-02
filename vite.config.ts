import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
    cssInjectedByJsPlugin(),
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
        // plugins: [tailwindcss(tailwindConfig)],
      },
    },
  },
  css: {
    postcss: './postcss.config.js', // Ensure PostCSS config is used
  },
});
