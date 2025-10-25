// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
// No cors import needed

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    // No cors() plugin needed here
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
    // --- Use the built-in CORS option ---
    cors: true // This enables CORS for all origins
  },
})