import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(() => {
  // Read environment variables with fallbacks
  const pwaName = process.env.VITE_PWA_NAME || 'DonePin - Task Management'
  const pwaShortName = process.env.VITE_PWA_SHORT_NAME || 'DonePin'
  const pwaDescription = process.env.VITE_PWA_DESCRIPTION || 'A minimal, fast, installable PWA for task management'
  const pwaThemeColor = process.env.VITE_PWA_THEME_COLOR || '#3b82f6'
  const pwaBackgroundColor = process.env.VITE_PWA_BACKGROUND_COLOR || '#ffffff'
  const pwaDisplay = process.env.VITE_PWA_DISPLAY || 'standalone'
  const pwaOrientation = process.env.VITE_PWA_ORIENTATION || 'portrait'
  const pwaStartUrl = process.env.VITE_PWA_START_URL || '/'
  const pwaScope = process.env.VITE_PWA_SCOPE || '/'
  const apiBase = process.env.VITE_API_BASE || 'http://localhost:3000/api'
  const cacheMaxEntries = Number(process.env.VITE_CACHE_MAX_ENTRIES) || 50
  const cacheMaxAgeSeconds = Number(process.env.VITE_CACHE_MAX_AGE_SECONDS) || 300
  const cacheNetworkTimeoutSeconds = Number(process.env.VITE_CACHE_NETWORK_TIMEOUT_SECONDS) || 10

  return {
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: pwaName,
        short_name: pwaShortName,
        description: pwaDescription,
        theme_color: pwaThemeColor,
        background_color: pwaBackgroundColor,
        display: pwaDisplay as 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser',
        orientation: pwaOrientation as 'portrait' | 'landscape' | 'any',
        start_url: pwaStartUrl,
        scope: pwaScope,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        categories: ['productivity', 'utilities'],
        screenshots: [],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.href.startsWith(apiBase)
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: cacheNetworkTimeoutSeconds,
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: cacheMaxEntries,
                maxAgeSeconds: cacheMaxAgeSeconds,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  }
})
