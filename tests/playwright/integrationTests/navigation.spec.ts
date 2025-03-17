import test, { expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Navigate between uploaded files", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden').first();
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        await page.waitForSelector("text=Edit Files", {
            state: "visible",
            timeout: 2000,
        });

        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        await page.waitForSelector("text=Currently Viewing: CR000000.dcm", {
            state: "visible",
            timeout: 1000,
        });

        await page.waitForSelector('button:has-text("Next")', {
            state: "visible",
            timeout: 1000,
        });

        await page.click('button:has-text("Next")');

        await page.waitForSelector("text=Currently Viewing: CR000001.dcm", {
            state: "visible",
            timeout: 5000,
        });

        await page.waitForSelector('button:has-text("Previous")', {
            state: "visible",
            timeout: 1000,
        });

        await page.click('button:has-text("Previous")');
        await page.waitForSelector("text=Currently Viewing: CR000000.dcm", {
            state: "visible",
            timeout: 5000,
        });
    } catch (error) {
        console.error("Error navigating between files:", error);
        throw error;
    }
});
