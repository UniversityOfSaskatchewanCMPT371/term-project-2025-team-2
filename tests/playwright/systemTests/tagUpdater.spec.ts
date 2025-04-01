import { test as base, expect } from '@playwright/test';
import path from 'path';
//import fs from 'fs';

const MODALITIES = ['CT', 'MR', 'CR', 'US'];

// Define test fixtures
type TestFixtures = {
    page: any;
    modality: string;
};

// Extend the base test with our fixtures
const test = base.extend<TestFixtures>({
    modality: ['CT', { option: true }],
});

// Helper function to set up the page for each test
async function setupPage(page: any, modality: string) {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    
    // Wait for the file input to be ready
    await page.waitForSelector('input[type="file"]', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    
    // Upload a DICOM file
    const filePath = path.join(
        process.cwd(),
        'test-data',
        'test_dicoms',
        'gen_dicom_files',
        'all_mod_fullVR',
        modality,
        `${modality}_test_dicom_0.dcm`
    );
    
    console.log(`Uploading ${modality} file:`, filePath);
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Wait for the main DICOM table to load
    console.log('Waiting for table to load...');
    await page.waitForSelector('table.mt-4.min-w-full', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
}

test.describe('TagUpdater System Tests', () => {
    // Test for loading DICOM files
    for (const modality of MODALITIES) {
        test(`should load ${modality} DICOM file and display tags in table`, async ({ page }) => {
            await setupPage(page, modality);
            
            // Verify that the table contains DICOM tags
            const table = await page.locator('table.mt-4.min-w-full');
            await expect(table).toBeVisible();
            
            // Check for common DICOM tags
            const commonTags = ['Patient Name', 'Patient ID', 'Study Instance UID'];
            for (const tag of commonTags) {
                console.log(`Checking for tag in ${modality}:`, tag);
                await expect(page.getByText(tag, { exact: false })).toBeVisible({ timeout: 10000 });
            }
        });
    }

    // Test for updating numeric VR tags
    for (const modality of MODALITIES) {
        test(`should update numeric VR tags for ${modality}`, async ({ page }) => {
            await setupPage(page, modality);
            
            // Find and update a numeric VR tag (e.g., Slice Thickness)
            console.log(`Looking for Slice Thickness tag in ${modality}...`);
            const sliceThicknessRow = await page.getByText('Slice Thickness', { exact: false }).locator('..');
            await sliceThicknessRow.scrollIntoViewIfNeeded();
            
            const sliceThicknessCell = await sliceThicknessRow.getByRole('cell').nth(2);
            console.log('Updating Slice Thickness value...');
            await sliceThicknessCell.dblclick();
            await sliceThicknessCell.fill('2.5');
            await page.keyboard.press('Enter');
            
            // Verify the update
            await expect(sliceThicknessCell).toHaveText('2.5');
        });
    }

    // Test for updating text VR tags
    for (const modality of MODALITIES) {
        test(`should update text VR tags for ${modality}`, async ({ page }) => {
            await setupPage(page, modality);

            // Find and update a text VR tag (e.g., Patient Name)
            console.log(`Looking for Patient Name tag in ${modality}...`);
            const patientNameRow = await page.getByText('Patient Name', { exact: false }).locator('..');
            await patientNameRow.scrollIntoViewIfNeeded();

            const patientNameCell = await patientNameRow.getByRole('cell').nth(2);
            console.log('Updating Patient Name value...');
            await patientNameCell.dblclick();
            await patientNameCell.fill('Updated Patient Name');
            await page.keyboard.press('Enter');

            // Verify the update
            await expect(patientNameCell).toHaveText('Updated Patient Name');
        });
    }
});
    