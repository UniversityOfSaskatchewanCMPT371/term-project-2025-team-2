import test, { expect } from "@playwright/test";

export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Edit a DICOM tag and save file", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/CR000001.dcm");

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 5000,
        });

        const tagRow = page
            .locator("tr")
            .filter({ hasText: "SOPClassUID" })
            .first();

        const editButton = tagRow.locator("svg.h-6.w-6").first();
        await expect(editButton).toBeVisible();
        await editButton.click();

        await page.waitForTimeout(1000);

        const tagInput = tagRow.locator("input").first();
        await expect(tagInput).toBeVisible();
        await tagInput.fill("New Value");

        const saveButton = page.getByRole("button", {
            name: "Download File",
        });
        await expect(saveButton).toBeEnabled();
        await saveButton.click();
    } catch (error) {
        console.error("Error editing DICOM tag:", error);
        throw error;
    }
});
