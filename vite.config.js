import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Dev-only proxy: the Worker's CORS allows only kuntips.no, so in local dev the
// browser cannot call it directly. Routing API paths through the dev server
// makes them same-origin. `bypass` keeps SPA page navigations (text/html) out
// of the proxy — /creators is both an API prefix and a page route.
const BACKEND = "https://kuntips-backend.eternalnor.workers.dev";
const apiProxy = {
  target: BACKEND,
  changeOrigin: true,
  bypass: (req) =>
    req.headers.accept && req.headers.accept.includes("text/html")
      ? "/index.html"
      : null,
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/stats": apiProxy,
      "/settings": apiProxy,
      "/creators": apiProxy,
      "/auth": apiProxy,
      "/tips": apiProxy,
      "/referral": apiProxy,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
})
