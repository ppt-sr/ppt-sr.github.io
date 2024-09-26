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
                404: resolve(__dirname, "sites/404.html"),
                about: resolve(__dirname, "sites/about/index.html"),

                chapter1: resolve(__dirname, "sites/chapter-1/index.html"),
                    chapter1mobile: resolve(__dirname, "sites/chapter-1/mobile/index.html"),
                    chapter1pcguides: resolve(__dirname, "sites/chapter-1/pc/guides/index.html"),
                    chapter1pcstrats: resolve(__dirname, "sites/chapter-1/pc/strats/index.html"),
                    chapter1console: resolve(__dirname, "sites/chapter-1/console/index.html"),

                chapter2: resolve(__dirname, "sites/chapter-2/index.html"),
                    chapter2mobile: resolve(__dirname, "sites/chapter-2/mobile/index.html"),
                    chapter2pcguides: resolve(__dirname, "sites/chapter-2/pc/guides/index.html"),
                    chapter2pcstrats: resolve(__dirname, "sites/chapter-2/pc/strats/index.html"),
                    chapter2console: resolve(__dirname, "sites/chapter-2/console/index.html"),

                chapter3: resolve(__dirname, "sites/chapter-3/index.html"),
                    chapter3pcguides: resolve(__dirname, "sites/chapter-3/pc/guides/index.html"),
                    chapter3pcstrats: resolve(__dirname, "sites/chapter-3/pc/strats/index.html"),
                    chapter3console: resolve(__dirname, "sites/chapter-3/console/index.html"),
                
            }
        }
    }
});