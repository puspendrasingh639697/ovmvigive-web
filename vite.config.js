// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   base: './', // ये change करें
//   build: {
//     outDir: 'dist',
//     assetsDir: 'assets',
//     emptyOutDir: true
//   }
// })









// // extra code

// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })








// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // export default defineConfig({
// //   plugins: [react()],
// //   base: './', // ये change करें
// //   build: {
// //     outDir: 'dist',
// //     assetsDir: 'assets',
// //     emptyOutDir: true
// //   }
// // })



















// // vite.config.js me ye add karein
// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // export default defineConfig({
// //   plugins: [react()],
// //   build: {
// //     minify: 'terser',
// //     terserOptions: {
// //       compress: {
// //         drop_console: true,
// //         drop_debugger: true,
// //         pure_funcs: ['console.log', 'console.warn']
// //       },
// //       mangle: {
// //         properties: {
// //           regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/
// //         }
// //       }
// //     },
// //     sourcemap: false,
// //     rollupOptions: {
// //       output: {
// //         manualChunks: undefined,
// //         compact: true
// //       }
// //     }
// //   }
// // })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})