// vitest.config.ts
import { defineConfig, mergeConfig } from "vitest/config";
import base from "../vitest.config.base";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default mergeConfig(
  base,
  defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: path.resolve(__dirname, "src/tests/setupTests.ts"),
      include: ["src/tests/**/*.{test,spec}.{ts,tsx}"],
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
      },
    },
  })
);
