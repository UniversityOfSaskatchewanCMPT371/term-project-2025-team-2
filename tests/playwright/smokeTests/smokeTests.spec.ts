import { test, expect } from "@playwright/test";
import * as fs from "fs";

import * as path1 from "path";
import { fileURLToPath } from "url";

export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

const DEBUG = process.env.DEBUG_TESTS === "true" || false;

const debug = (message: string) => {
    if (DEBUG) {
        console.log(message);
    }
};

test("Upload dicom and verify file name matches tag displayed", async ({
    page,
}) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path1.dirname(__filename);

    try {
        await page.goto(BASE_URL);
        await page.waitForSelector('h1:text("DICOM Tag Editor")', {
            state: "visible",
        });

        const dicomDir = "./test-data/test_dicoms/gen_dicom_files/simple_files";
        const dicomFiles = fs
            .readdirSync(dicomDir)
            .filter((file) => file.endsWith(".dcm"))
            .map((file) => dicomDir + "/" + file);

        debug(`Found ${dicomFiles.length} DICOM files to upload`);

        if (dicomFiles.length === 0) {
            throw new Error("No DICOM files found in the directory");
        }

        const fileInput = page.locator('input[type="file"].hidden').first();
        await fileInput.setInputFiles(dicomFiles[0]);

        await page.waitForSelector("text=/Currently Viewing: .+\.dcm/", {
            state: "visible",
            timeout: 5000,
        });

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 5000,
        });

        await page.waitForTimeout(1000);

        if (DEBUG) {
            await page.screenshot({
                path: `${__dirname}/screenshots/screenshot-smoke.png`,
                fullPage: true,
            });
        }

        const PatientIDRow = page
            .locator("tr", {
                has: page.locator("td", { hasText: "X00100020" }),
            })
            .first();

        await expect(PatientIDRow).toBeVisible({ timeout: 1000 });

        const currentlyViewingText = await page
            .locator("text=/Currently Viewing: .+\.dcm/")
            .textContent();
        debug(
            `File ${dicomFiles[0]} - Currently viewing: ${currentlyViewingText}`
        );

        const filenameMatch = currentlyViewingText?.match(
            /Currently Viewing: (.+\.dcm)/
        );
        const filename = filenameMatch ? filenameMatch[1] : "";

        const fileNumberMatch = filename.match(/(\d+)/);
        const fileNumber = fileNumberMatch ? fileNumberMatch[0] : "";

        debug(`File ${dicomFiles[0]} - File number: ${fileNumber}`);

        const patientIDValue = await PatientIDRow.locator("td")
            .nth(2)
            .textContent();

        debug(`File ${dicomFiles[0]} - PatientID value: ${patientIDValue}`);

        expect(patientIDValue).toContain(fileNumber);

        debug(
            `File ${dicomFiles[0]} - Verified: PatientID contains the file number`
        );
    } catch (error) {
        console.error("Test failed:", error);
        throw error;
    }
});

test("Toggle sidebar", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        await page.waitForSelector("text=Files", {
            state: "visible",
            timeout: 2000,
        });
    } catch (error) {
        console.error("Error toggling sidebar:", error);
        throw error;
    }
});
