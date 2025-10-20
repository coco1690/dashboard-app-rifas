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
    minify: 'esbuild',
    sourcemap: false, // cambia a true si necesitas depurar producción
    cssCodeSplit: true, // mejora tiempos de carga en producción
    chunkSizeWarningLimit: 1000, // evita warnings por archivos grandes
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