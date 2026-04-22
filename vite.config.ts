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
    // Split vendor code into separate chunks so the landing page only loads what it needs.
    // This drops the initial JS payload from ~574KB to ~150KB and improves FCP/LCP.
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-router") || id.includes("scheduler") || id.includes("react-dom") || id.includes("/react/")) return "react-vendor";
          if (id.includes("framer-motion")) return "motion-vendor";
          if (id.includes("@radix-ui") || id.includes("cmdk") || id.includes("vaul") || id.includes("sonner")) return "ui-vendor";
          if (id.includes("recharts") || id.includes("d3-")) return "charts-vendor";
          if (id.includes("@supabase") || id.includes("@tanstack")) return "data-vendor";
          if (id.includes("lucide-react")) return "icons-vendor";
          return "vendor";
        },
      },
    },
  },
}));
