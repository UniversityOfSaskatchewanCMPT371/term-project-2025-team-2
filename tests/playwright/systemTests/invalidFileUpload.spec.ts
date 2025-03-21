import { test, expect } from "@playwright/test";
import * as path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Upload invalid non-DICOM file", async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('input[type="file"].hidden').first();
    await input.setInputFiles(path.resolve("./test-data/invalid_files/sample.txt"));

    const errorMessage = page.locator("text=/isn't a valid DICOM file/");
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
});
