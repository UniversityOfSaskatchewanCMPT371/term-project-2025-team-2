import { test, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe.parallel("DICOM Multi-Tab Stress Test", () => {
    const totalTabs = 3;
    const totalFiles = 20;
    const filePath = path.resolve(__dirname, "../../../test-data/test_dicoms/gen_dicom_files/test_dicom_0.dcm");

    for (let i = 0; i < totalTabs; i++) {
        test(`Tab ${i + 1} should upload files`, async ({ browser }) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto("http://localhost:5173");


            const fileInput = page.locator('input[type="file"].hidden').first();
            await fileInput.setInputFiles(new Array(totalFiles).fill(filePath));

            await page.waitForSelector('text=Edit Files');
            await page.locator('button#no').click();

            await page.locator('[data-testid="sidebar-toggle-button"]').click();
            await page.waitForTimeout(1000);

            const uploadedFilesLocator = page.locator('h4.text-sm.font-medium.text-base-content\\/70');
            await uploadedFilesLocator.waitFor({ state: "visible", timeout: 10000 });

            const uploadedFilesText = await uploadedFilesLocator.innerText();
            const uploadedFiles = parseInt(uploadedFilesText.match(/\d+/)[0], 10);

            expect(uploadedFiles).toBe(totalFiles);

            await context.close();
        });
    }
});
