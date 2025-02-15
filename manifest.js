const manifestForPlugIn = {
    registerType: "prompt",
    includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
        "maskable_icon.png",
    ],
    manifest: {
        name: "DICOM Viewer",
        short_name: "DICOM Viewer",
        description: "A Progressive Web App for viewing DICOM files",
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
        prefer_related_applications: false,
    },
};
