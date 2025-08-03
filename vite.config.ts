import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import path from "path";
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
        svelte(),
    ],
    resolve: {
        alias: {
            $lib: path.resolve("./src/lib"),
        },
    },
    build: {
        target: "esnext",
        lib: {
            entry: path.resolve(__dirname, "src/main.ts"),
            name: "RobotLogEnhancer",
            fileName: () => "robot-log-enhancer.umd.js",
            formats: ["umd"],
        },
    },
});

