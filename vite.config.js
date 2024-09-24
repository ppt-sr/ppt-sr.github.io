import { defineConfig } from "vite";
import {resolve} from "path";
export default defineConfig({
    base: "/", // Replace with your GitHub repo name
    root: "sites",
    publicDir: "public",
    build: {
        outDir: "../dist",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "sites/index.html"),
                about: resolve(__dirname, "sites/about/index.html"),
                chapter1: resolve(__dirname, "sites/chapter-1/index.html"),
                chapter2: resolve(__dirname, "sites/chapter-2/index.html"),
                chapter3: resolve(__dirname, "sites/chapter-3/index.html")
            }
        }
    }
});