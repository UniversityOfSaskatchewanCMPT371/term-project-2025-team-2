import test, { expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Upload DICOM file", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/000000.dcm");

        await page.waitForSelector("text=/Currently Viewing: .+\.dcm/", {
            state: "visible",
            timeout: 2000,
        });

    } catch (error) {
        console.error("Error during file upload:", error);
        throw error;
    }
});

test("View DICOM tags for an uploaded file", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/CR000001.dcm");
        
        await page.waitForSelector("text=/Currently Viewing: .+\.dcm/", {
            state: "visible",
            timeout: 5000,
        });

        const sopClassUID = page
            .locator("tr", {
                has: page.locator("td", { hasText: "SOPClassUID" }),
            })
            .first();
        await expect(sopClassUID).toBeVisible();

    } catch (error) {
        console.error("Error viewing DICOM tags:", error);
        throw error;
    }
});
