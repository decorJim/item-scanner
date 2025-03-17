import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/item-scanner/', // force vite to use relative path
  plugins: [react()],
  build: {
    outDir: 'build', // This ensures that the output is directed to the 'build' folder
    assetsDir: 'assets',
  },
})
