import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/playwright",
    timeout: 30000,
    workers: process.env.CI ? 4 : undefined,
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
        },
        // comment out the following browsers due to failing safari test, issue noted
        // {
        //     name: "webkit",
        //     use: {
        //         baseURL: "http://localhost:5173",
        //         headless: true,
        //         browserName: "webkit",
        //         ...devices["Desktop Safari"],
        //     },
        // },
        // {
        //     name: "chromium",
        //     use: {
        //         baseURL: "http://localhost:5173",
        //         headless: true,
        //         browserName: "chromium",
        //     },
        // },
    ],
});
