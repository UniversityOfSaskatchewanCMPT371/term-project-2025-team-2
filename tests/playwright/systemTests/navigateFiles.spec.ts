import { test, expect } from "@playwright/test";
import * as path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Navigate between DICOM files using Next/Previous", async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('input[type="file"].hidden').first();
    await input.setInputFiles([
        path.resolve("./test-data/test_dicoms/gen_dicom_files/test_dicom_0.dcm"),
        path.resolve("./test-data/test_dicoms/gen_dicom_files/test_dicom_1.dcm"),
        path.resolve("./test-data/test_dicoms/gen_dicom_files/test_dicom_2.dcm"),
    ]);

    await page.waitForSelector("text=Edit Files", { timeout: 5000 });
    await page.locator("#no").click();
    await page.waitForSelector("text=/Currently Viewing: .+\\.dcm/", { timeout: 5000 });

    const label = page.locator("text=/Currently Viewing: .+\\.dcm/");
    const firstView = await label.textContent();

    await page.getByRole("button", { name: "Next" }).click();
    const secondView = await label.textContent();
    expect(secondView).not.toBe(firstView);

    await page.getByRole("button", { name: "Previous" }).click();
    const backToFirst = await label.textContent();
    expect(backToFirst).toBe(firstView);
});
