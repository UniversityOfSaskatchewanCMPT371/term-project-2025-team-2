import test, { expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Upload DICOM file", async ({ page }) => {
    try {
        // Navigate to your DICOM tag editor
        await page.goto(BASE_URL);

        // Upload a DICOM file
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/000000.dcm");

        console.log("File uploaded successfully");
    } catch (error) {
        console.error("Error during file upload:", error);
        throw error; // Re-throw to fail the test
    }
});

test("View DICOM tags for an uploaded file", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Upload a DICOM file
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/CR000001.dcm");

        // Wait for the DICOM tags table to be visible
        const tagTable = page.locator("table").first();
        await expect(tagTable).toBeVisible();

        const sopClassUID = page
            .locator("tr", {
                has: page.locator("td", { hasText: "SOPClassUID" }),
            })
            .first();
        await expect(sopClassUID).toBeVisible();

        console.log("DICOM tags for the uploaded file are visible");
    } catch (error) {
        console.error("Error viewing DICOM tags:", error);
        throw error;
    }
});
