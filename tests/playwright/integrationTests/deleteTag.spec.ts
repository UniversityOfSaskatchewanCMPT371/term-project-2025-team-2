import { test, expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test.setTimeout(120000);

test.describe.configure({ mode: "parallel" });

test("Click delete tag button state check", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden').first();
        await fileInput.setInputFiles(
            "./test-data/test_dicoms/gen_dicom_files/test_dicom_0.dcm"
        );

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 5000,
        });

        const tagRow = page
            .locator("tr")
            .filter({ hasText: "X00080020" })
            .first();
        await expect(tagRow).toBeVisible();

        const deleteIcon = tagRow.locator('svg[aria-label="Delete Tag"]');
        await expect(deleteIcon).toBeVisible();

        await expect(deleteIcon).toBeEnabled();

        await deleteIcon.click();

        const undoDeleteIcon = tagRow.locator('svg[aria-label="Undo Delete"]');
        await expect(undoDeleteIcon).toBeVisible();
    } catch (error) {
        console.error("Error verifying delete functionality:", error);
        throw error;
    }
});
