import { test, expect, Page } from "@playwright/test";

export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";
const DEBUG = process.env.DEBUG_TESTS === "true";

const debug = (msg: string) => DEBUG && console.log(msg);

test("Edit tag value in auto-anon list", async ({ page }) => {
    try {
        await page.goto(BASE_URL);
        await openAutoAnonEditor(page);

        await updateTagValue(page, "X0008", "New Value");

        await clickOutside(page); 

        await openAutoAnonEditor(page); 

        await verifyTagValue(page, "X0008", "New Value");
    } catch (err) {
        console.error("Test failed:", err);
        throw err;
    }
});

async function openAutoAnonEditor(page: Page) {
    debug("Opening sidebar and settings...");
    const sidebarToggle = page.locator('button >> svg[data-slot="icon"]').first();
    await sidebarToggle.waitFor();
    await sidebarToggle.click();

    const settingsIcon = page.locator("svg.size-6.cursor-pointer");
    await settingsIcon.click();

    const helpIcon = page
        .locator('div:has-text("Settings")')
        .locator("svg.mb-4.size-6.cursor-pointer.text-base-content\\/70");

    await expect(helpIcon).toBeVisible();
    await helpIcon.click();

    await expect(page.locator(".modal-box")).toBeVisible();

    const advancedBtn = page.getByRole("button", { name: /Advanced/i });
    await advancedBtn.click();

    const editTags = page.locator("li").filter({ hasText: "Edit Auto-Anon Tags" });
    await editTags.click();
    debug("Auto-Anon tag editor opened");
}

async function updateTagValue(page: Page, tagCode: string, newValue: string) {
    const tagRow = page.locator("tr").filter({ hasText: tagCode }).first();
    const editBtn = tagRow.locator("svg.h-6.w-6").first();

    await expect(editBtn).toBeVisible();
    await editBtn.click();

    const input = tagRow.locator("input").first();
    await expect(input).toBeVisible();
    await input.fill(""); // clear existing value
    await input.fill(newValue);

    const saveBtn = page.getByRole("button", { name: /Save/i }).first();
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    debug(`Tag ${tagCode} updated to "${newValue}"`);
}

async function verifyTagValue(page: Page, tagCode: string, expectedValue: string) {
    const tagRow = page.locator("tr").filter({ hasText: tagCode }).first();
    const valueCell = tagRow.locator("td").nth(2);

    await expect(valueCell).toContainText(expectedValue);
    debug(`Verified tag ${tagCode} = "${expectedValue}"`);
}

async function clickOutside(page: Page) {
    const vp = page.viewportSize() || { width: 1280, height: 720 };
    await page.mouse.click(vp.width / 2, vp.height / 2);
}