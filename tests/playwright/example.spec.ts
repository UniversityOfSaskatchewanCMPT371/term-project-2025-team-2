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

test('Edit a DICOM tag and save changes', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Upload a DICOM file
    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles('./test-data/CR000001.dcm');

    // Wait for the uploaded file to appear and debug if needed
    await page.waitForTimeout(2000); // Handle slow rendering
    await page.innerHTML('body')

    // Find the row containing 'SOPClassUID'
    const tagRow = page.locator('tr').filter({ hasText: 'SOPClassUID' }).first();
    await expect(tagRow).toBeVisible();

    // Click the edit button (pencil icon) in that row
    const editButton = tagRow.locator('svg.h-6.w-6'); // Pencil button
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Now find and edit the input field
    const tagInput = tagRow.locator('input');
    await expect(tagInput).toBeVisible();
    await tagInput.fill('New Value');

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save Single File Edits' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    console.log("Done Editing the Dicom file")
});