import { test, expect, chromium, webkit } from "@playwright/test";

/**
 * Test that in Safari, the download option cannot be changed.
 * and in non-Safari browsers, the download option can be changed.
 */
test.describe("Safari DownloadOption Component", () => {
    test("should not allow changing download option for Safari", async () => {
        // Launch the Safari (webkit) browser
        const browser = await webkit.launch();

        const context = await browser.newContext();
        await context.clearCookies();

        const page = await browser.newPage();
        await page.goto("http://localhost:5173");

        // clear any saved downloadOption in localStorage
        await page.evaluate(() => {
            localStorage.clear();
        });

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        const promptText = page.locator(".my-4").first();
        await expect(promptText).toBeVisible();

        const noButton = page.locator("button", { hasText: "No" }).first();
        await expect(noButton).toBeVisible();
        await noButton.click();

        const currentFile = page
            .locator("text=Currently Viewing: CR000000.dcm")
            .first();
        await expect(currentFile).toBeVisible();

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const checkbox = await page.locator("#download-option");
        expect(checkbox).toBeChecked();

        await checkbox.click();
        await expect(checkbox).toBeChecked();

        await browser.close();
    });

    test("should allow changing download option for non-Safari browsers", async () => {
        // Launch a Chromium browser (non-Safari)
        const browser = await chromium.launch();

        const context = await browser.newContext();
        await context.clearCookies();

        const page = await browser.newPage();
        await page.goto("http://localhost:5173");

        // clear any saved downloadOption in localStorage
        await page.evaluate(() => {
            localStorage.clear();
        });

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        const promptText = page.locator(".my-4").first();
        await expect(promptText).toBeVisible();

        const noButton = page.locator("button", { hasText: "No" }).first();
        await expect(noButton).toBeVisible();
        await noButton.click();

        const currentFile = page
            .locator("text=Currently Viewing: CR000000.dcm")
            .first();
        await expect(currentFile).toBeVisible();

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const checkbox = await page.locator("#download-option");

        await expect(checkbox).not.toBeChecked();

        await checkbox.click();
        await expect(checkbox).toBeChecked();

        await browser.close();
    });
});
