import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/playwright",
    timeout: 30000,
    workers: 4,
    webServer: {
        command: 'npm run dev',
        port: 5173,
        reuseExistingServer: !process.env.CI, // Avoids duplicate servers in local runs
    },
    use: {
        baseURL: 'http://localhost:5173',
        headless: true,
        browserName: "firefox",
    },

});
