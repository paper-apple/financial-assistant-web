/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
  },
  // server: {
  //   host: '0.0.0.0',
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.100.4:3000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.ts", // см. п.3
    include: ['src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
})


// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       // все запросы к /expenses будут перенаправляться на порт 3001
//       "/expenses": {
//         target: "http://localhost:8000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });