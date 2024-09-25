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
                    chapter1mobile: resolve(__dirname, "sites/chapter-1/mobile/index.html"),
                    chapter1pc: resolve(__dirname, "sites/chapter-1/pc/index.html"),
                    chapter1console: resolve(__dirname, "sites/chapter-1/console/index.html"),
                chapter2: resolve(__dirname, "sites/chapter-2/index.html"),
                    chapter2mobile: resolve(__dirname, "sites/chapter-2/mobile/index.html"),
                    chapter2pc: resolve(__dirname, "sites/chapter-2/pc/index.html"),
                    chapter2console: resolve(__dirname, "sites/chapter-2/console/index.html"),
                chapter3: resolve(__dirname, "sites/chapter-3/index.html"),
                    chapter3mobile: resolve(__dirname, "sites/chapter-3/mobile/index.html"),
                    chapter3pc: resolve(__dirname, "sites/chapter-3/pc/index.html"),
                    chapter3console: resolve(__dirname, "sites/chapter-3/console/index.html"),
            }
        }
    }
});