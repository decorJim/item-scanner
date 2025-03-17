import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/item-scanner/', // add for github pages
  plugins: [react()],
  build: {
    outDir: 'build', // This ensures that the output is directed to the 'build' folder
  },
})
