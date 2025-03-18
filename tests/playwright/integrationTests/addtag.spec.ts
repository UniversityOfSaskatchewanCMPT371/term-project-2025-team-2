import { test, expect } from "@playwright/test";
import * as fs from "fs";

import AdmZip from "adm-zip";
import { promisify } from "util";

export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

const DEBUG = process.env.DEBUG_TESTS === "true" || false;

const debug = (message: string) => {
    if (DEBUG) {
        console.log(message);
    }
};

test("Add tag and verify", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden').first();
        await fileInput.setInputFiles("./test-data/CR000000.dcm");

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 10000,
        });

        const institutionNameRow = page
            .locator("tr", {
                has: page.locator("td", { hasText: "PatientName" }),
            })
            .first();

        await expect(institutionNameRow).toBeVisible({ timeout: 5000 });

        const addButton = page.getByRole("button", { name: /Add Tag/i }).nth(0);
        await expect(addButton).toBeVisible({ timeout: 5000 });
        await addButton.click();

        const tagRow = page.locator("tr").filter({ hasText: "X" }).first();

        const tagInput = tagRow.locator("input").first();
        await expect(tagInput).toBeVisible();
        await tagInput.fill("00080007");


        const tagValue = tagRow.locator("input").nth(2);
        await expect(tagValue).toBeVisible();
        await tagValue.fill("value");

        const saveButton = tagRow.locator("svg.h-6.w-6").first();
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        await page.waitForTimeout(500);

        const downloadPromise = page.waitForEvent("download");

        const downButton = page.getByRole("button", { name: /Download File/i });
        await expect(downButton).toBeVisible({ timeout: 1000 });
        await downButton.click();

        const download = await downloadPromise;

        const filePath = await download.path();

        await fileInput.setInputFiles(filePath);

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 10000,
        });

        const addedRowAfterReupload = page
            .locator("tr", {
                has: page.locator("td", { hasText: "X00080007" }),
            })
            .first();

        await expect(addedRowAfterReupload).toBeVisible({
            timeout: 5000,
        });

        const finalValue = await addedRowAfterReupload
            .locator("td")
            .nth(2)
            .textContent();
        expect(finalValue).toBe("value");
    } catch (error) {
        console.error("Test failed:", error);
        throw error;
    }
});
