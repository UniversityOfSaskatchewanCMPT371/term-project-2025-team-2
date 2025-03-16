import { test, expect } from "@playwright/test";

export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

const DEBUG = process.env.DEBUG_TESTS === "true" || false;

const debug = (message: string) => {
    if (DEBUG) {
        console.log(message);
    }
};

test("Add tag to auto list", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const editButton = page.getByRole("button", { name: /Edit Auto-Anon Tag/i });
        await expect(editButton).toBeVisible({ timeout: 1000 });
        await editButton.click();
        await page.waitForTimeout(500);

        const addButton = page.getByRole("button", { name: /Add Tag/i });
        await expect(addButton).toBeVisible({ timeout: 1000 });
        await addButton.click();

        const tagRow = page.locator("tr").filter({ hasText: "X" }).first();

        const tagInput = tagRow.locator("input").first();
        await expect(tagInput).toBeVisible();
        await tagInput.fill("00080007");

        const tagName = tagRow.locator("input").nth(1);
        await expect(tagName).toBeVisible();
        await tagName.fill("name");

        const tagValue = tagRow.locator("input").nth(2);
        await expect(tagValue).toBeVisible();
        await tagValue.fill("value");

        const saveButton = tagRow.locator("svg.h-6.w-6").first();
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        await page.waitForTimeout(500);

        const closeButton = page.getByRole("button", { name: /Close/i });
        await expect(closeButton).toBeVisible({ timeout: 1000 });
        await closeButton.click();

        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        await settingsButton.click();

        await page.waitForTimeout(500);
        const editButton2 = page.getByRole("button", { name: /Edit Auto-Anon Tag/i });
        await expect(editButton2).toBeVisible({ timeout: 1000 });
        await editButton2.click();

        await page.waitForTimeout(500);

        const newTagRow = page.locator("tr").filter({ hasText: "X00080007" }).first();

        expect(newTagRow).not.toBe(null);


    } catch (error) {
        console.error("Test failed:", error);
        throw error;
    }
});
