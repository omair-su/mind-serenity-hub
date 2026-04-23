import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    // Let Rollup compute chunks automatically. Manual chunking previously
    // split React into "react-vendor" while transitively-used libs landed in
    // "vendor", which loaded before react-vendor and crashed at module init
    // with "Cannot read properties of undefined (reading 'createContext')".
    // The default chunking is safe and still benefits from the route-level
    // lazy() splits in src/App.tsx for fast FCP.
    rollupOptions: {},
  },
}));
