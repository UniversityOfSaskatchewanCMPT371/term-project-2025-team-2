import { test, expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test.setTimeout(120000);

test.describe.configure({ mode: "parallel" });

test("Verify delete functionality for a DICOM tag", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Upload a DICOM file
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/CR000001.dcm");

        // Wait for the uploaded file to appear
        await page.waitForTimeout(2000); // Handle slow rendering

        // Find the row containing the tag you want to delete (e.g., 'SOPClassUID')
        const tagRow = page
            .locator("tr")
            .filter({ hasText: "SOPClassUID" })
            .first();
        await expect(tagRow).toBeVisible();

        // Locate the delete icon inside the row
        const deleteIcon = tagRow.locator('svg[aria-label="Delete Tag"]');
        await expect(deleteIcon).toBeVisible();

        // Verify the delete icon is clickable
        await expect(deleteIcon).toBeEnabled();

        await deleteIcon.click();

        const undoDeleteIcon = tagRow.locator('svg[aria-label="Undo Delete"]');
        await expect(undoDeleteIcon).toBeVisible();

        console.log("Delete functionality for DICOM tag verified");
    } catch (error) {
        console.error("Error verifying delete functionality:", error);
        throw error;
    }
});
