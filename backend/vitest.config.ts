// // backend/vitest.config.ts
// import { defineConfig, mergeConfig } from "vitest/config";
// import baseConfig from "../vitest.config.base";

// export default mergeConfig(
//   baseConfig,
//   defineConfig({
//     test: {
//       // здесь можно переопределить окружение или добавить специфические настройки
//       environment: "node",
//       setupFiles: ["./test/setup.ts"], // если есть
//     },
//     resolve: {
//       alias: {
//         "@backend": "backend/src",
//       },
//     },
//   })
// );


import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "../vitest.config.base";
import path from "path";

export default mergeConfig(
  baseConfig,
  defineConfig({
    resolve: {
      alias: {
        src: path.resolve(__dirname, "./src"),
      },
    },
    test: {
      setupFiles: "./src/tests/setup.ts",
      include: ["src/tests/**/*.{test,spec,int-spec}.{ts,tsx}"],
    }
  })
);

// test: {
//       environment: "jsdom",
//       setupFiles: path.resolve(__dirname, "src/tests/setupTests.ts"),
//       include: ["src/tests/**/*.{test,spec}.{ts,tsx}"],
//     },