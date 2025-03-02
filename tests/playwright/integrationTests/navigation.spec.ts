import test, { expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Navigate between uploaded files", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Upload multiple DICOM files
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        // Wait for the upload to complete and prompt to appear
        // More robust way to wait for the prompt
        await page.waitForTimeout(10000);

        // Click "No" to edit files individually
        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        // Wait for the UI to update after selection
        await page.waitForTimeout(1000);

        // Verify the first file is displayed
        await page.waitForSelector("text=Currently Viewing: CR000000.dcm", {
            state: "visible",
            timeout: 5000,
        });

        // Navigate to the next file - find by role and text for more reliability
        await page.waitForSelector('button:has-text("Next")', {
            state: "visible",
            timeout: 5000,
        });
        await page.click('button:has-text("Next")');

        // Wait for the UI to update after navigation
        await page.waitForTimeout(1000);

        // Verify the second file is displayed
        await page.waitForSelector("text=Currently Viewing: CR000001.dcm", {
            state: "visible",
            timeout: 5000,
        });

        // Navigate back to the previous file
        await page.waitForSelector('button:has-text("Previous")', {
            state: "visible",
            timeout: 5000,
        });
        await page.click('button:has-text("Previous")');

        // Wait for the UI to update after navigation
        await page.waitForTimeout(1000);

        // Verify the first file is displayed again
        await page.waitForSelector("text=Currently Viewing: CR000000.dcm", {
            state: "visible",
            timeout: 5000,
        });

        console.log("Successfully navigated between files");
    } catch (error) {
        console.error("Error navigating between files:", error);
        throw error;
    }
});
