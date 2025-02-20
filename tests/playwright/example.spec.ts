// // @ts-check
// import { test, expect } from "@playwright/test";
//
// test("has title", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
//
//     // Expect a title "to contain" a substring.
//     await expect(page).toHaveTitle(/Playwright/);
// });
//
// test("get started link", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
//
//     // Click the get started link.
//     await page.getByRole("link", { name: "Get started" }).click();
//
//     // Expects page to have a heading with the name of Installation.
//     await expect(
//         page.getByRole("heading", { name: "Installation" })
//     ).toBeVisible();
// });

import { test, expect } from '@playwright/test';
test('Upload DICOM file ', async ({ page }) => {
    // Navigate to your DICOM tag editor
    await page.goto(' http://localhost:5173');

    // Upload a DICOM file
    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles("./test-data/000000.dcm");
    console.log('File uploaded');
});

test('View DICOM tags for an uploaded file', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Upload a DICOM file
    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles('./test-data/CR000001.dcm');
    await page.waitForTimeout(1000);

    // Verify that the DICOM tags table is displayed
    const tagTable = page.locator('table');
    await expect(tagTable).toBeVisible();

    const sopClassUID = page.locator('tr', { has: page.locator('td', { hasText: "SOPClassUID" }) }).first();
    await expect(sopClassUID).toBeVisible();
    console.log("Dicom tags for the uploaded file is visible")
});
