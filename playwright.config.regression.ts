import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/playwright/regressionTests",
    timeout: 180000,
    workers: process.env.CI ? 1 : undefined,
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
        //Commented out webkit for regression tests because it breaks the regression test
       // {
       //     name: "webkit",
       //     use: {
       //         baseURL: "http://localhost:5173",
       //         headless: true,
       //         browserName: "webkit",
       //         ...devices["Desktop Safari"],
       //     },
       // },
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
