import test, { expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Verify question mark icon is clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const settingsSection = page.locator('div:has-text("Settings")');

        const questionMarkIcon = settingsSection.locator(
            "svg.mb-4.size-6.cursor-pointer.text-base-content\\/70"
        );
        await expect(questionMarkIcon).toBeVisible();

        await expect(questionMarkIcon).toBeEnabled();

        await questionMarkIcon.click();

        const modalOrMenu = page.locator(".modal-box");
        await expect(modalOrMenu).toBeVisible();

    } catch (error) {
        console.error("Error verifying question mark icon:", error);
        throw error;
    }
});

test("Verify GitHub link is clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click(); 

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const settingsSection = page.locator('div:has-text("Settings")');

        const questionMarkIcon = settingsSection.locator(
            "svg.mb-4.size-6.cursor-pointer.text-base-content\\/70"
        );
        await expect(questionMarkIcon).toBeVisible();
        await expect(questionMarkIcon).toBeEnabled();

        await questionMarkIcon.click();

        const modalOrMenu = page.locator(".modal-box");
        await expect(modalOrMenu).toBeVisible();

        const githubLink = page.locator(
            'a.link.link-info:has-text("Detailed User Guide")'
        );
        await expect(githubLink).toBeVisible();
        await expect(githubLink).toBeEnabled();

        const href = await githubLink.getAttribute("href");
        expect(href).toBe(
            "https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2"
        );

    } catch (error) {
        console.error("Error verifying GitHub link:", error);
        throw error;
    }
});
test("Verify GitHub link opens correct URL", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const settingsSection = page.locator('div:has-text("Settings")');

        // Locate the question mark icon using its specific class
        const questionMarkIcon = settingsSection.locator(
            "svg.mb-4.size-6.cursor-pointer.text-base-content\\/70"
        );
        await expect(questionMarkIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(questionMarkIcon).toBeEnabled();

        // Click the icon to open the modal or menu
        await questionMarkIcon.click();

        const modalOrMenu = page.locator(".modal-box");
        await expect(modalOrMenu).toBeVisible();

        // Locate the GitHub link inside the modal or menu
        const githubLink = page.locator(
            'a.link.link-info:has-text("Detailed User Guide")'
        );
        await expect(githubLink).toBeVisible();

        const [newPage] = await Promise.all([
            page.waitForEvent("popup"), // Wait for the new tab to open
            githubLink.click(), // Click the link
        ]);

        await newPage.waitForLoadState("load");

        const actualUrl = newPage.url();
        expect(actualUrl).toBe(
            "https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2"
        );

    } catch (error) {
        console.error("Error verifying GitHub link URL:", error);
        throw error;
    }
});
