import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait(), eslint()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});