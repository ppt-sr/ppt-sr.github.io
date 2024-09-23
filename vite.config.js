import { defineConfig } from "vite";
import {resolve} from "path";
export default defineConfig({
    base: "/", // Replace with your GitHub repo name
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname,"index.html"),
                about: resolve(__dirname,"src/pages/about.html")
            }
        }
    }
});