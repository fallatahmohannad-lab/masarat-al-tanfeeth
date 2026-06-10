import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages serves the app under a repository sub-path. `base` must match
  // the repo name exactly so all bundled assets/icons resolve (no 404s).
  // If you name the repo something other than "masarat-al-tanfeeth", change this.
  base: '/masarat-al-tanfeeth/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
