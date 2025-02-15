import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugIn: Partial<VitePWAOptions> = {
    registerType: "prompt",
    includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "maskable_icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
    ],
    manifest: {
        name: "DICOM Tag Editor",
        short_name: "DICOM Editor",
        description: "A Progressive Web App for viewing and editing DICOM files",
        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/maskable_icon.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
        theme_color: "#171717",
        background_color: "#f0e7db",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
    },
    devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
    },
    strategies: 'generateSW',
    injectRegister: 'auto',
    minify: false,
    workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        cleanupOutdatedCaches: true,
        sourcemap: true,
        navigationPreload: true,
        skipWaiting: false,
        clientsClaim: false,
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'google-fonts-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            },
            {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'gstatic-fonts-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    },
                }
            }
        ]
    }
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA(manifestForPlugIn)],
    server: {
        port: 5173,
        strictPort: true
    }
});
