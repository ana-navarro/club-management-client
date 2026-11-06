import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // File events do not reach a Docker container on a Windows or macOS host.
    watch: { usePolling: process.env.VITE_USE_POLLING === 'true' },
  },
})
