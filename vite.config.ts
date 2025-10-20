// import path from "path"
// import tailwindcss from "@tailwindcss/vite"
// import react from '@vitejs/plugin-react-swc'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//    plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//    server: {
//     // host: '0.0.0.0', // Permite conexiones externas
//     host: true,
//     port: 5173,
//     allowedHosts: [
//       '.ngrok.io',
//       '.ngrok-free.app'
//     ]
//   }
// })


import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimizaciones para producción
    target: 'esnext',
    minify: 'terser',
    sourcemap: false, // Cambia a true si necesitas debugging en producción
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      '.ngrok.io',
      '.ngrok-free.app'
    ]
  }
})