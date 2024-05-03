import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Sanitas/',
  test: {
    environment: "jsdom",
    setupFiles: "./src/__test__/ui/UITestSetup.js",
  },
});
