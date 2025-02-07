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
        name: "React-vite-app",
        short_name: "react-vite-app",
        description: "I am a simple vite app",
        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "favicon",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "favicon",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "apple touch icon",
            },
            {
                src: "/maskable_icon.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
        theme_color: "#171717",
        background_color: "#f0e7db",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
    },
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA(manifestForPlugIn)],
});
