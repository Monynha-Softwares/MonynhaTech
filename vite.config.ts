import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname, "apps/web-monynha-tech"),
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@/components/ui": path.resolve(__dirname, "./packages/ui/src"),
      "@/integrations/supabase": path.resolve(__dirname, "./packages/supabase/src"),
      "@": path.resolve(__dirname, "./apps/web-monynha-tech/src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: path.resolve(
      __dirname,
      "./apps/web-monynha-tech/src/test/setup.ts"
    ),
    exclude: ["node_modules", "dist", ".git", "tests/**"],
  },
}));
