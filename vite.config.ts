import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/item-scanner/', // force vite to use relative path
  plugins: [react()],
})
