import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/nawy-calc/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Nawy Calc',
        short_name: 'Nawy Calc',
        description: 'حاسبة عربية سريعة وواضحة',
        lang: 'ar',
        dir: 'rtl',
        start_url: '/nawy-calc/',
        scope: '/nawy-calc/',
        display: 'standalone',
        background_color: '#f4f1eb',
        theme_color: '#f4f1eb',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/nawy-calc/index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
})
