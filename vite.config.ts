import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["shadcn", "@radix-ui/react-icons", "tailwind-variants"],
  },
  ssr: {
    external: ["shadcn"],
  },
});
