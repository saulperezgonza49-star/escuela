import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // Importante para que Electron cargue correctamente las rutas relativas
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173
  }
})