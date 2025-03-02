import test, { expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Edit a DICOM tag and save changes", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Upload a DICOM file
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("../../../test-data/CR000001.dcm");

        // Wait for the row containing 'SOPClassUID' to be visible
        const tagRow = page
            .locator("tr")
            .filter({ hasText: "SOPClassUID" })
            .first();
        // await expect(tagRow).toBeVisible();
        await page.waitForTimeout(1000);

        // Click the edit button (pencil icon) in that row
        const editButton = tagRow.locator("svg.h-6.w-6").first();
        await expect(editButton).toBeVisible();
        await editButton.click();

        await page.waitForTimeout(1000);

        // Now find and edit the input field
        const tagInput = tagRow.locator("input").first();
        await expect(tagInput).toBeVisible();
        await tagInput.fill("New Value");

        // Save changes
        const saveButton = page.getByRole("button", {
            name: "Download File",
        });
        await expect(saveButton).toBeEnabled();
        await saveButton.click();

        console.log("DICOM file edited and saved successfully");
    } catch (error) {
        console.error("Error editing DICOM tag:", error);
        throw error;
    }
});
