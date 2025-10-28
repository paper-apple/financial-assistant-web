// // vitest.config.base.ts
// import { defineConfig } from "vitest/config";

// export default defineConfig({
//   test: {
//     globals: true,
//     coverage: {
//       reporter: ["text", "json", "html"],
//     },
//     // по умолчанию окружение node (для бэкенда)
//     environment: "node",
//     include: ["**/*.spec.ts", "**/*.test.ts"],
//   },
//   resolve: {
//     alias: {
//       "@": "/src", // общий алиас, если нужно
//     },
//   },
// });


// /// <reference types="vitest" />
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: '0.0.0.0',
//   },
//   test: {
//     globals: true,
//     environment: "jsdom",
//     setupFiles: "./src/tests/setupTests.ts", // см. п.3
//     include: ['src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
//   },
// })


// apps/frontend/vitest.config.ts
// import { defineConfig, mergeConfig } from "vitest/config";
// import base from "../vitest.config.base";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";

// export default mergeConfig(
//   base,
//   defineConfig({
//     plugins: [react()],
//     test: {
//       environment: "jsdom",
//       setupFiles: path.resolve(__dirname, "src/tests/setupTests.ts"),
//     },
//     resolve: {
//       alias: {
//         "@frontend": path.resolve(__dirname, "src"),
//       },
//     },
//   })
// );

// frontend/vitest.config.ts
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
