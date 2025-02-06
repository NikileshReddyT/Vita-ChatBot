import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.VITE_GEMINI_API_KEY': `"${process.env.VITE_GEMINI_API_KEY}"`
  },
  server: {
    port: 3000,
    open: true
  }
})
