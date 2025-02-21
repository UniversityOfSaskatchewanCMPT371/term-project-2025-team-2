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

test('Navigate between uploaded files', async ({ page }) => {
    // Navigate to your DICOM tag editor
    await page.goto('http://localhost:5173');

    // Upload multiple DICOM files
    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles(['./test-data/CR000000.dcm', './test-data/CR000001.dcm']);

    // Wait for the prompt to appear (edit individually or in series)
    const promptText = page.locator('p', { hasText: 'Multiple files have been uploaded. Do you want to edit individually?' });
    await expect(promptText).toBeVisible();

    // Click "Yes" to edit files individually
    const yesButton = page.locator('button', { hasText: 'No' });
    await expect(yesButton).toBeVisible();
    await yesButton.click();

    // Wait for the first file to load
    await page.waitForTimeout(2000); // Adjust timeout if needed

    // Verify the first file is displayed
    const currentFile = page.locator('text=Currently Viewing: CR000000.dcm');
    await expect(currentFile).toBeVisible();

    // Navigate to the next file
    const nextButton = page.locator('button', { hasText: 'Next' });
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Verify the second file is displayed
    const secondFile = page.locator('text=Currently Viewing: CR000001.dcm');
    await expect(secondFile).toBeVisible();

    const prevButton = page.locator('button', { hasText: 'Previous' });
    await expect(prevButton).toBeVisible();
    await prevButton.click();

    // Verify the second file is displayed
    const prevFile = page.locator('text=Currently Viewing: CR000000.dcm');
    await expect(prevFile).toBeVisible();

    console.log("Successfully navigating between the files")
});

test('Toggle night mode - verify click', async ({ page }) => {
    // Navigate to your DICOM tag editor
    await page.goto('http://localhost:5173');

    // Locate the night mode toggle (checkbox inside the label)
    const nightModeToggle = page.locator('label.swap.swap-rotate input[type="checkbox"]');
    await expect(nightModeToggle).toBeVisible();

    // Locate the parent label for the toggle
    const nightModeLabel = page.locator('label.swap.swap-rotate');
    await expect(nightModeLabel).toBeVisible();

    // Check the initial state of the toggle (unchecked by default)
    await expect(nightModeToggle).not.toBeChecked();

    // Click the label to toggle night mode
    await nightModeLabel.click();

    // Verify the toggle is checked (click was successful)
    await expect(nightModeToggle).toBeChecked();

    // Click the label again to switch back to light mode
    await nightModeLabel.click();

    // Verify the toggle is unchecked (click was successful)
    await expect(nightModeToggle).not.toBeChecked();
    console.log("Toggle night mode working successfully")
});

test('Toggle sidebar', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const sidebarToggleButton = page.locator('button >> svg[data-slot="icon"]');
    await sidebarToggleButton.waitFor(); // Ensure button is present

    const sidebar = page.locator('.sidebar');
    console.log(await sidebar.count()); // Check if sidebar exists before clicking

    await sidebarToggleButton.click(); // Open sidebar
    console.log("Toggle sidebar working successfully")
});

test('Saving changes using Side bar toggle test', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles(['./test-data/CR000000.dcm', './test-data/CR000001.dcm']);

    // Wait for the prompt to appear (edit individually or in series)
    const promptText = page.locator('p', { hasText: 'Multiple files have been uploaded. Do you want to edit individually?' });
    await expect(promptText).toBeVisible();

    // Click "Yes" to edit files individually
    const yesButton = page.locator('button', { hasText: 'No' });
    await expect(yesButton).toBeVisible();
    await yesButton.click();

    // Wait for the first file to load
    await page.waitForTimeout(2000); // Adjust timeout if needed

    // Verify the first file is displayed
    const currentFile = page.locator('text=Currently Viewing: CR000000.dcm');
    await expect(currentFile).toBeVisible();

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


    const sidebarToggleButton = page.locator('button >> svg[data-slot="icon"]');
    await sidebarToggleButton.waitFor(); // Ensure button is present

    const sidebar = page.locator('.sidebar');
    console.log(await sidebar.count()); // Check if sidebar exists before clicking

    await sidebarToggleButton.click(); // Open sidebar

    const saveAllFilesButton = page.locator('button', { hasText: 'Save All Files' });
    await expect(saveAllFilesButton).toBeVisible();

    // Click the "Save All Files" button
    await saveAllFilesButton.click();
    console.log("Save file button working successfully on sidebar toggle");
});

test('Testing edit individually and series button in side bar', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles(['./test-data/CR000000.dcm', './test-data/CR000001.dcm']);

    // Wait for the prompt to appear (edit individually or in series)
    const promptText = page.locator('p', { hasText: 'Multiple files have been uploaded. Do you want to edit individually?' });
    await expect(promptText).toBeVisible();

    // Click "Yes" to edit files individually
    const yesButton = page.locator('button', { hasText: 'No' });
    await expect(yesButton).toBeVisible();
    await yesButton.click();

    // Wait for the first file to load
    await page.waitForTimeout(2000); // Adjust timeout if needed

    // Verify the first file is displayed
    const currentFile = page.locator('text=Currently Viewing: CR000000.dcm');
    await expect(currentFile).toBeVisible();

    const sidebarToggleButton = page.locator('button >> svg[data-slot="icon"]');
    await sidebarToggleButton.waitFor(); // Ensure button is present

    const sidebar = page.locator('.sidebar');
    console.log(await sidebar.count()); // Check if sidebar exists before clicking

    await sidebarToggleButton.click(); // Open sidebar

    const editIndividuallyButton = page.locator('button', { hasText: 'Editing Individually' });
    await expect(editIndividuallyButton).toBeVisible();

    // Click the "Editing Individually" button
    await editIndividuallyButton.click();

    // Locate the "Editing as Series" button
    const editAsSeriesButton = page.locator('button', { hasText: 'Editing as Series' });
    await expect(editAsSeriesButton).toBeVisible();

    // Click the "Editing as Series" button
    await editAsSeriesButton.click();
    console.log("Edit buttons working completely fine");

});

test('Navigating from files from sidebar test', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles(['./test-data/CR000000.dcm', './test-data/CR000001.dcm']);

    const promptText = page.locator('p', { hasText: 'Multiple files have been uploaded. Do you want to edit individually?' });
    await expect(promptText).toBeVisible();

    const noButton = page.locator('button', { hasText: 'No' });
    await expect(noButton).toBeVisible();
    await noButton.click();

    await page.waitForTimeout(2000);

    const currentFile = page.locator('text=Currently Viewing: CR000000.dcm');
    await expect(currentFile).toBeVisible();

    const sidebarToggleButton = page.locator('button >> svg[data-slot="icon"]');
    await sidebarToggleButton.waitFor();
    await sidebarToggleButton.click();

    // Fixing selector issue for sidebar file list
    const sidebarFileList = page.locator('div.mt-2.rounded-lg').nth(0).locator('table.w-full tbody');
    await sidebarFileList.waitFor();

    const firstFile = sidebarFileList.locator('text=CR000000.dcm').first();
    await expect(firstFile).toBeVisible();
    await firstFile.click();

    const currentFileSidebar = page.locator('text=Currently Viewing: CR000000.dcm');
    await expect(currentFileSidebar).toBeVisible();

    const secondFile = sidebarFileList.locator('text=CR000001.dcm').first();
    await expect(secondFile).toBeVisible();
    await secondFile.click();

    await expect(page.locator('text=Currently Viewing: CR000001.dcm')).toBeVisible();
});
