import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/playwright/integrationTests",
    timeout: 180000,
    workers: process.env.CI ? 6 : 6,
    webServer: {
        command: "npm run dev",
        port: 5173,
        reuseExistingServer: !process.env.CI, // Avoids duplicate servers in local runs
        timeout: 120000,
    },
    projects: [
        {
            name: "firefox",
            use: {
                baseURL: "http://localhost:5173",
                headless: true,
                browserName: "firefox",
            },
            fullyParallel: true,
        },
        {
            name: "chromium",
            use: {
                baseURL: "http://localhost:5173",
                headless: true,
                browserName: "chromium",
            },
        },
    ],
});