import { test, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe("DICOM Folder Upload Load Test", () => {
    const folderPath = path.resolve(__dirname, "../../../test-data/test_dicoms/gen_dicom_files/simple_files/");

    test("should upload a folder containing multiple DICOM files", async ({ page }) => {
        await page.goto("http://localhost:5173");


        const folderInput = page.locator('input[type="file"][webkitdirectory]');
        if (!(await folderInput.count())) {
            throw new Error("Folder input not found! Check the selector.");
        }

        await folderInput.setInputFiles(folderPath);

        await page.waitForSelector('text=Edit Files');
        await page.locator('button#no').click();

        await page.locator('[data-testid="sidebar-toggle-button"]').click();
        await page.waitForTimeout(1000);


        const uploadedFilesLocator = page.locator('h4.text-sm.font-medium.text-base-content\\/70');
        await uploadedFilesLocator.waitFor({ state: "visible", timeout: 10000 });

        const uploadedFilesText = await uploadedFilesLocator.innerText();
        const uploadedFiles = parseInt(uploadedFilesText.match(/\d+/)[0], 10);

        console.log(`Uploaded files count: ${uploadedFiles}`);

        expect(uploadedFiles).toBeGreaterThan(0);
    });
});
