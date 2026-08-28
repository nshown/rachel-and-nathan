/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.svg',
                'apple-touch-icon.png',
                'pwa-192x192.png',
                'pwa-512x512.png',
                'pwa-maskable-512x512.png',
            ],
            manifest: {
                name: 'Rachel & Nathan',
                short_name: 'Rachel & Nathan',
                description: 'Celebrating Rachel & Nathan, year round.',
                theme_color: '#1C1116',
                background_color: '#1C1116',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                    {
                        src: 'pwa-maskable-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                // Precache only the app shell; photos/videos are cached on demand.
                globPatterns: ['**/*.{js,css,html,woff2,svg}'],
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => url.pathname.startsWith('/media/'),
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'media-cache',
                            expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 60 },
                            cacheableResponse: { statuses: [0, 200] },
                            rangeRequests: true,
                        },
                    },
                ],
            },
        }),
    ],
    base: '/',
    build: {
        outDir: 'dist',
    },
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
})
