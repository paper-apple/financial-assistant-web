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


// vitest.config.base.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
