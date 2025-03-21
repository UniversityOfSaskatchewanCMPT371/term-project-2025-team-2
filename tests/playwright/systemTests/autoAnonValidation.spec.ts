import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Verify auto anonymization", async ({ page }) => {
    await page.goto(BASE_URL);

    const dicomDir = path.resolve(__dirname, "../../../test-data/test_dicoms/gen_dicom_files/simple_files");

    if (!fs.existsSync(dicomDir)) {
        throw new Error(`Directory not found: ${dicomDir}`);
    }

    const dicomFiles = fs.readdirSync(dicomDir)
        .filter(file => file.endsWith(".dcm"))
        .map(file => path.join(dicomDir, file));

    if (dicomFiles.length === 0) {
        throw new Error(`No DICOM files found in ${dicomDir}`);
    }

    dicomFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            throw new Error(`File not found: ${file}`);
        }
    });

    const fileInput = page.locator('input[type="file"].hidden').first();
    await fileInput.setInputFiles(dicomFiles);

    await page.waitForSelector("text=Edit Files", { state: "visible", timeout: 5000 });

    const noButton = page.locator("#no");
    await noButton.click();

    await page.waitForSelector("table", { state: "visible", timeout: 5000 });

    const autoAnonButton = page.locator("button:has-text('Auto Anon')");
    await autoAnonButton.click();

    const okAnonButton = page.locator("button:has-text('OK')");
    await okAnonButton.click();

});
