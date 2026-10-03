import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";
export default defineConfig({
  root: "prev",
  plugins: [{ name: "preview-no-shell", enforce: "pre", transform(code: string, id: string) { if (id.replace(/\\/g, "/").endsWith("/routes/__root.tsx")) return code.replace("shellComponent: RootShell,", ""); return null; } }, react(), tailwindcss(), viteSingleFile()],
  resolve: { alias: [
    { find: "@/assets/logo.png.asset.json", replacement: path.resolve(__dirname, "prev/logo.json") },
    { find: "@", replacement: path.resolve(__dirname, "src") } ] },
  build: { outDir: "../prev-dist", emptyOutDir: true, assetsInlineLimit: 100000000 },
});
