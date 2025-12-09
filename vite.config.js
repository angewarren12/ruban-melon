import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
  // Pas de "base" spécifié = par défaut c'est "/" (ce qu'on veut pour Netlify)
})
