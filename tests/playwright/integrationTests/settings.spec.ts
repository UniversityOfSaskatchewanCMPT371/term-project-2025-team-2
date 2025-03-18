import test, { expect } from "@playwright/test";
import exp from "constants";

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
            .locator('label.mb-2.cursor-pointer.label svg[data-slot="icon"]')
            .first();
        await expect(moonIcon).toBeVisible();
        await expect(moonIcon).toBeEnabled();

        await moonIcon.click();
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

        const label = page.locator("label.mb-2.cursor-pointer.label");

        const setThemeToggle = label.locator("#theme-option");
        await expect(setThemeToggle).toBeVisible();

        const isInitiallyChecked = await setThemeToggle.isChecked();

        await setThemeToggle.click();

        const isNowChecked = await setThemeToggle.isChecked();
        expect(isNowChecked).toBe(!isInitiallyChecked);
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
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const sunIcon = page
            .locator('label.mb-2.cursor-pointer.label svg[data-slot="icon"]')
            .nth(1);
        await expect(sunIcon).toBeVisible();

        await expect(sunIcon).toBeEnabled();
        await sunIcon.click();
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
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const label = page.locator("label.mb-2.cursor-pointer.label");

        const showHiddenTagsToggle = label.locator("#hidden-tag-option");
        await expect(showHiddenTagsToggle).toBeVisible();

        const isInitiallyChecked = await showHiddenTagsToggle.isChecked();

        await showHiddenTagsToggle.click();

        const isNowChecked = await showHiddenTagsToggle.isChecked();
        expect(isNowChecked).toBe(!isInitiallyChecked);
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
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const showHiddenTagsSection = page
            .locator('p:has-text("Show Hidden Tags")')
            .locator("xpath=..");

        const leftIcon = showHiddenTagsSection
            .locator('svg[data-slot="icon"]')
            .first();

        await expect(leftIcon).toBeVisible();
        await expect(leftIcon).toBeEnabled();
        await leftIcon.click();

        const checkbox = page.locator("#theme-option");
        // wait for the checkbox to actually be visible
        await checkbox.waitFor({ state: "visible", timeout: 5000 });
        await page.waitForTimeout(500);
        expect(checkbox).toBeChecked();
        //waits for checkbox to update
        const checked = await checkbox.isChecked();
        expect(checked).toBeTruthy();
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
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const showHiddenTagsSection = page
            .locator('p:has-text("Show Hidden Tags")')
            .locator("xpath=..");

        const rightIcon = showHiddenTagsSection
            .locator('svg[data-slot="icon"]')
            .nth(1);

        await expect(rightIcon).toBeVisible();
        await expect(rightIcon).toBeEnabled();

        await rightIcon.click();

        const checkbox = page.locator("#theme-option");
        await page.waitForTimeout(500);

        //expect(checkbox).toBeChecked();
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
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const closeButton = page.locator('button:has-text("Close")').first();
        await expect(closeButton).toBeEnabled();

        await closeButton.click();

        const settingsMenu = page.locator("div[role=dialog]");
        await expect(settingsMenu).not.toBeVisible();
    } catch (error) {
        console.error("Error verifying Close button:", error);
        throw error;
    }
});
