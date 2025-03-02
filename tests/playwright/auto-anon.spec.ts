import { test, expect } from '@playwright/test';
import * as fs from 'fs';

import AdmZip from 'adm-zip';
import { promisify } from 'util';

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

test('Auto anonymize DICOM file and verify changes', async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles('./test-data/CR000000.dcm');

        await page.waitForTimeout(1000);

        const searchInput = page.getByPlaceholder(/Search tags.../i) || 
                            page.locator('input[type="text"]').first();
        
        await searchInput.clear();
        
        await searchInput.fill("InstitutionName");
        await searchInput.press("Enter");
        
        await page.waitForTimeout(500);

        await page.waitForSelector('table', { state: 'visible', timeout: 10000 });

        const institutionNameRow = page.locator('tr', {
            has: page.locator('td', { hasText: 'InstitutionName' })
        }).first();

        await expect(institutionNameRow).toBeVisible({ timeout: 5000 });

        const downloadPromise = page.waitForEvent('download');

        const autoAnonButton = page.getByRole('button', { name: /Auto Anon/i });
        await expect(autoAnonButton).toBeVisible({ timeout: 5000 });
        await autoAnonButton.click();

        const download = await downloadPromise;

        const zipFilePath = await download.path();

        const path = zipFilePath.split("/")

        fs.readdir("/" + path[1] + "/" + path[2] + "/", (err, files) => {
            if (err) {
                console.log('Unable to scan directory:', err);
            } else {
                console.log('Contents of the folder:');
                files.forEach((file) => {
                    console.log(file);
                });
            }
        });

        const extractDir = "/" + path[1] + "/" + path[2] + "/extracted";

        if (!await existsAsync(extractDir)) {
            await mkdirAsync(extractDir, { recursive: true });
        }

        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(extractDir, true);

        fs.readdir(extractDir, (err, files) => {
            if (err) {
                console.log('Unable to scan directory:', err);
            } else {
                console.log('Ext Contents of the folder:');
                files.forEach((file) => {
                    console.log(file);
                });
            }
        });


        const files = fs.readdirSync(extractDir);
        const dicomFile = files.find(file => file.endsWith('.dcm'));

        if (!dicomFile) {
            throw new Error("No DICOM file found in the extracted zip");
        }

        await page.waitForTimeout(1000);

        await fileInput.setInputFiles(extractDir + '/' + dicomFile);

        await page.waitForSelector('table', { state: 'visible', timeout: 10000 });

        const institutionNameRowAfterReupload = page.locator('tr', {
            has: page.locator('td', { hasText: 'InstitutionName' })
        }).first();

        await expect(institutionNameRowAfterReupload).toBeVisible({ timeout: 5000 });
        
        await searchInput.clear();
        
        await searchInput.fill("InstitutionName");
        await searchInput.press("Enter");
        
        await page.waitForTimeout(500);

        const finalValue = await institutionNameRowAfterReupload.locator('td').nth(2).textContent();
        expect(finalValue).toBe('ANONYMOUS');

        fs.rmSync(extractDir, { recursive: true, force: true });

    } catch (error) {
        console.error("Test failed:", error);
        throw error;
    }
});