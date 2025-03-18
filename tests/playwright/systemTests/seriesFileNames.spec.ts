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

test("Upload dicoms and verify file name matches tags displayed", async ({
    page,
}) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path1.dirname(__filename);

    try {
        await page.goto(BASE_URL);

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
        await fileInput.setInputFiles(dicomFiles);

        await page.waitForSelector("text=Edit Files", {
            state: "visible",
            timeout: 5000,
        });

        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        await page.waitForSelector("text=/Currently Viewing: .+\.dcm/", {
            state: "visible",
            timeout: 1000,
        });

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 1000,
        });

        let fileCount = 0;
        let hasMoreFiles = true;

        while (hasMoreFiles) {
            fileCount++;
            debug(`Checking file #${fileCount}...`);

            if (DEBUG) {
                await page.screenshot({
                    path: `${__dirname}/screenshots/screenshot-file-${fileCount}.png`,
                    fullPage: true,
                });
            }

            const PatientIDRow = page
                .locator("tr", {
                    has: page.locator("td", { hasText: "PatientID" }),
                })
                .first();

            await expect(PatientIDRow).toBeVisible({ timeout: 1000 });

            const currentlyViewingText = await page
                .locator("text=/Currently Viewing: .+\.dcm/")
                .textContent();
            debug(
                `File ${fileCount} - Currently viewing: ${currentlyViewingText}`
            );

            const filenameMatch = currentlyViewingText?.match(
                /Currently Viewing: (.+\.dcm)/
            );
            const filename = filenameMatch ? filenameMatch[1] : "";

            const fileNumberMatch = filename.match(/(\d+)/);
            const fileNumber = fileNumberMatch ? fileNumberMatch[0] : "";

            debug(`File ${fileCount} - File number: ${fileNumber}`);

            const patientIDValue = await PatientIDRow.locator("td")
                .nth(2)
                .textContent();

            debug(`File ${fileCount} - PatientID value: ${patientIDValue}`);

            expect(patientIDValue).toContain(fileNumber);

            debug(
                `File ${fileCount} - Verified: PatientID contains the file number`
            );

            const nextButton = page.getByRole("button", { name: /Next/i });
            const isDisabled = await nextButton.getAttribute("disabled");

            if (isDisabled === "true" || isDisabled === "") {
                debug(
                    "Next button is disabled. We have reached the last file."
                );
                hasMoreFiles = false;
            } else {
                await nextButton.click();
                debug("Clicked Next button");

                await page.waitForTimeout(1000);

                await page.waitForSelector(
                    "text=/Currently Viewing: .+\.dcm/",
                    {
                        state: "visible",
                        timeout: 500,
                    }
                );
            }
            if (!DEBUG) {
                process.stdout.write(". ");
            }
        }
        console.log(`\nSuccessfully checked ${fileCount} files`);
    } catch (error) {
        // Always log errors regardless of debug setting
        console.error("\nTest failed:", error);
        throw error;
    }
});
