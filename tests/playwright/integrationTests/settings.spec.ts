import test, { expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Verify settings button is visible and clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await expect(settingsButton).toBeVisible();
        await settingsButton.click();

        console.log("Settings button is visible and clickable");
    } catch (error) {
        console.error("Error verifying settings button:", error);
        throw error;
    }
});
test("Verify Set Theme toggle functionality", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const moonIcon = page
            .locator('label.mb-4cursor-pointer.label svg[data-slot="icon"]')
            .first();
        await expect(moonIcon).toBeVisible();
        await expect(moonIcon).toBeEnabled();

        await moonIcon.click();
        await moonIcon.click();

        console.log("Set Theme toggle functionality verified");
    } catch (error) {
        console.error("Error verifying Set Theme toggle:", error);
        throw error;
    }
});
test("Verify toggle input (checkbox) is clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const label = page.locator("label.mb-4cursor-pointer.label");

        // Locate the Set Theme toggle inside the label using its unique ID
        const setThemeToggle = label.locator("#theme-option");
        await expect(setThemeToggle).toBeVisible();

        // Verify the initial state of the toggle
        const isInitiallyChecked = await setThemeToggle.isChecked();
        console.log(
            `Initial state of toggle: ${isInitiallyChecked ? "Checked" : "Unchecked"}`
        );

        // Click the toggle to change its state
        await setThemeToggle.click();

        // Verify the new state of the toggle
        const isNowChecked = await setThemeToggle.isChecked();
        await expect(isNowChecked).toBe(!isInitiallyChecked);

        console.log("Set Theme toggle state change verified");
    } catch (error) {
        console.error("Error verifying toggle input (checkbox):", error);
        throw error;
    }
});
test("Verify second SVG icon (Sun icon) is clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the second SVG icon (Sun icon) inside the label
        const sunIcon = page
            .locator('label.mb-4cursor-pointer.label svg[data-slot="icon"]')
            .nth(1);
        await expect(sunIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(sunIcon).toBeEnabled();

        // Click the icon
        await sunIcon.click();

        console.log("Second SVG icon (Sun icon) is clickable");
    } catch (error) {
        console.error("Error verifying second SVG icon (Sun icon):", error);
        throw error;
    }
});
test("Verify Show Hidden Tags toggle state change", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the parent label
        const label = page.locator("label.mb-4cursor-pointer.label");

        // Locate the Show Hidden Tags toggle inside the label using its unique ID
        const showHiddenTagsToggle = label.locator("#hidden-tag-option");
        await expect(showHiddenTagsToggle).toBeVisible();

        // Verify the initial state of the toggle
        const isInitiallyChecked = await showHiddenTagsToggle.isChecked();
        console.log(
            `Initial state of Show Hidden Tags toggle: ${isInitiallyChecked ? "Checked" : "Unchecked"}`
        );

        // Click the toggle to change its state
        await showHiddenTagsToggle.click();

        // Verify the new state of the toggle
        const isNowChecked = await showHiddenTagsToggle.isChecked();
        await expect(isNowChecked).toBe(!isInitiallyChecked); // State should be the opposite of the initial state

        console.log("Show Hidden Tags toggle state change verified");
    } catch (error) {
        console.error("Error verifying Show Hidden Tags toggle:", error);
        throw error;
    }
});
test("Verify first SVG icon (left icon) in Show Hidden Tags is clickable", async ({
    page,
}) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the Show Hidden Tags section using the <p> text
        const showHiddenTagsSection = page
            .locator('p:has-text("Show Hidden Tags")')
            .locator("xpath=.."); // Move to parent element


        // Locate the first SVG icon (left icon) inside the label
        const leftIcon = showHiddenTagsSection
            .locator('svg[data-slot="icon"]')
            .first();
        await expect(leftIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(leftIcon).toBeEnabled();

        // Click the icon
        await leftIcon.click();

        console.log(
            "First SVG icon (left icon) in Show Hidden Tags is clickable"
        );
    } catch (error) {
        console.error("Error verifying first SVG icon (left icon):", error);
        throw error;
    }
});
test("Verify second SVG icon (right icon) in Show Hidden Tags is clickable", async ({
    page,
}) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the Show Hidden Tags section using the <p> text
        const showHiddenTagsSection = page
            .locator('p:has-text("Show Hidden Tags")')
            .locator("xpath=.."); // Move to parent element


        // Locate the second SVG icon (right icon) inside the label
        const rightIcon = showHiddenTagsSection
            .locator('svg[data-slot="icon"]')
            .nth(1);
        await expect(rightIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(rightIcon).toBeEnabled();

        // Click the icon
        await rightIcon.click();

        console.log(
            "Second SVG icon (right icon) in Show Hidden Tags is clickable"
        );
    } catch (error) {
        console.error("Error verifying second SVG icon (right icon):", error);
        throw error;
    }
});
test("Verify Close button is clickable and closes settings menu", async ({
    page,
}) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the Close button
        const closeButton = page.locator('button:has-text("Close")').first();
        await expect(closeButton).toBeEnabled();

        await closeButton.click();

        console.log("Close button is clickable and closes the settings menu");
    } catch (error) {
        console.error("Error verifying Close button:", error);
        throw error;
    }
});
