import { test, expect } from "@playwright/test";

export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

const DEBUG = process.env.DEBUG_TESTS === "true" || false;

const debug = (message: string) => {
    if (DEBUG) {
        console.log(message);
    }
};

test("Remove tag from auto list", async ({ page }) => {
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

        const editButton = page.getByRole("button", {
            name: /Edit Auto-Anon Tags/i,
        });
        await expect(editButton).toBeVisible({ timeout: 1000 });
        await editButton.click();
        await page.waitForTimeout(500);

        const tagRow = page
            .locator("tr")
            .filter({ hasText: "X00080050" })
            .first();

        const removeTagButton = tagRow.locator("svg.h-6.w-6").nth(1);
        await expect(removeTagButton).toBeVisible();
        await removeTagButton.click();

        const saveButton = page
            .getByRole("button", {
                name: /Save/i,
            })
            .first();

        await expect(saveButton).toBeEnabled();
        await saveButton.click();

        await page.waitForTimeout(500);

        await page.mouse.click(
            page.viewportSize().width / 2,
            page.viewportSize().height / 2
        );

        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        await settingsButton.click();

        await expect(questionMarkIcon).toBeVisible();
        await expect(questionMarkIcon).toBeEnabled();

        await questionMarkIcon.click();

        await expect(modalOrMenu).toBeVisible();

        await page.waitForTimeout(1000);

        const editButton2 = page.getByRole("button", {
            name: /Edit Auto-Anon Tags/i,
        });
        await expect(editButton2).toBeVisible({ timeout: 1000 });
        await editButton2.click();

        await page.waitForTimeout(500);

        await expect(page.locator("td:has-text('X00080050')")).toHaveCount(0);
    } catch (error) {
        console.error("Test failed:", error);
        throw error;
    }
});
