import { test, expect } from "@playwright/test";
import * as fs from "fs";

import { Test_TagsAnon } from "@auto/TagsAnon";

import AdmZip from "adm-zip";
import { promisify } from "util";

import * as path from "path";
import { fileURLToPath } from "url";

const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

// Debug flag - set to true to enable debug logging
const DEBUG = process.env.DEBUG_TESTS === "true" || false;

// Helper function for debug logging
const debug = (message: string) => {
    if (DEBUG) {
        console.log(message);
    }
};

test("Auto anon tags in series", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Get all files from the directory
        const dicomDir = "./test-data/test_dicoms/gen_dicom_files";
        const dicomFiles = fs
            .readdirSync(dicomDir)
            .filter((file) => file.endsWith(".dcm"))
            .map((file) => dicomDir + "/" + file);

        debug(`Found ${dicomFiles.length} DICOM files to upload`);

        if (dicomFiles.length === 0) {
            throw new Error("No DICOM files found in the directory");
        }

        // Upload all files at once
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles(dicomFiles);

        await page.waitForTimeout(1000);

        // Click "No" to edit files individually
        const noButton = page.locator("id=yes");
        await expect(noButton).toBeVisible();
        await noButton.click();

        // Wait for the UI to update after selection
        await page.waitForTimeout(1000);

        // Verify the first file is displayed
        await page.waitForSelector("text=/Currently Viewing: .+\.dcm/", {
            state: "visible",
            timeout: 5000,
        });

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 10000,
        });

        // Find the search input for PatientID
        const searchInput =
            page.getByPlaceholder(/Search tags.../i) ||
            page.locator('input[type="text"]').first();

        await page.waitForTimeout(500);

        const tagRow = page
            .locator("tr", {
                has: page.locator("td", { hasText: "PatientName" }),
            })
            .first();

        await expect(tagRow).toBeVisible({ timeout: 1000 });

        await expect(tagRow).not.toHaveText("ANONYMOUS");

        const downloadPromise = page.waitForEvent("download");

        const autoAnonButton = page.getByRole("button", { name: /Auto Anon/i });
        await expect(autoAnonButton).toBeVisible({ timeout: 5000 });
        await autoAnonButton.click();

        const download = await downloadPromise;

        const zipFilePath = await download.path();

        const zipFilePathParts = zipFilePath.split("/");

        if (DEBUG) {
            fs.readdir("/" + path[1] + "/" + path[2] + "/", (err, files) => {
                if (err) {
                    console.log("Unable to scan directory:", err);
                } else {
                    console.log("Contents of the folder:");
                    files.forEach((file) => {
                        console.log(file);
                    });
                }
            });
        }

        const extractDir =
            "/" +
            zipFilePathParts[1] +
            "/" +
            zipFilePathParts[2] +
            "/extracted";

        if (!(await existsAsync(extractDir))) {
            await mkdirAsync(extractDir, { recursive: true });
        }

        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(extractDir, true);

        if (DEBUG) {
            fs.readdir(extractDir, (err, files) => {
                if (err) {
                    console.log("Unable to scan directory:", err);
                } else {
                    console.log("Ext Contents of the folder:");
                    files.forEach((file) => {
                        console.log(file);
                    });
                }
            });
        }

        // const files = fs.readdirSync(extractDir);

        const dicomFile = fs
            .readdirSync(extractDir)
            .filter((file) => file.endsWith(".dcm"))
            .map((file) => extractDir + "/" + file);

        // const dicomFile = files.find(file => file.endsWith('.dcm'));

        if (!dicomFile) {
            throw new Error("No DICOM file found in the extracted zip");
        }

        await page.waitForTimeout(1000);

        await fileInput.setInputFiles(dicomFile);

        await page.waitForTimeout(1000);

        const no1Button = page.locator("id=no");
        await expect(no1Button).toBeVisible();
        await no1Button.click();

        // Wait for the UI to update after selection
        await page.waitForTimeout(1000);

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 10000,
        });

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Loop through all files using the Next button
        let fileCount = 0;
        let hasMoreFiles = true;

        while (hasMoreFiles) {
            fileCount++;
            debug(`Checking file #${fileCount}...`);

            // Take screenshot of the current file if in debug mode
            if (DEBUG) {
                await page.screenshot({
                    path: `${__dirname}/screenshots/screenshot-file-${fileCount}.png`,
                    fullPage: true,
                });
            }

            for (const tag of Test_TagsAnon) {
                const row = await page
                    .locator("tr", {
                        has: page.locator("td", { hasText: tag.name }),
                    })
                    .first();

                await expect(row).toBeVisible({ timeout: 5000 });

                // Get the PatientID value
                const rowValue = await row.locator("td").nth(2).textContent();

                debug(`File ${fileCount} - ${tag.name} value: ${rowValue}`);

                expect(rowValue).toContain(tag.value);

                const PatientIDRow = await page
                    .locator("tr", {
                        has: page.locator("td", { hasText: "PatientID" }),
                    })
                    .first();

                await expect(PatientIDRow).toBeVisible({ timeout: 5000 });

                // Get the current filename from the "Currently Viewing:" text
                const currentlyViewingText = await page
                    .locator("text=/Currently Viewing: .+\.dcm/")
                    .textContent();
                debug(
                    `File ${fileCount} - Currently viewing: ${currentlyViewingText}`
                );

                // Extract just the filename using regex
                const filenameMatch = currentlyViewingText?.match(
                    /Currently Viewing: (.+\.dcm)/
                );
                const filename = filenameMatch ? filenameMatch[1] : "";

                // Extract number from filename (assuming format like CR000001.dcm)
                const fileNumberMatch = filename.match(/(\d+)/);
                const fileNumber = fileNumberMatch ? fileNumberMatch[0] : "";

                debug(`File ${fileCount} - File number: ${fileNumber}`);

                const patientIDValue = await PatientIDRow.locator("td")
                    .nth(2)
                    .textContent();
                debug(`File ${fileCount} - PatientID value: ${patientIDValue}`);

                // Check if the PatientID contains the same number as the filename
                expect(patientIDValue).toContain(fileNumber);

                debug(
                    `File ${fileCount} - Verified: PatientID contains the file number`
                );
            }

            // Try to click the Next button if it's not disabled
            const nextButton = page.getByRole("button", { name: /Next/i });

            // Check if the Next button is disabled
            const isDisabled = await nextButton.getAttribute("disabled");

            if (isDisabled === "true" || isDisabled === "") {
                debug(
                    "Next button is disabled. We have reached the last file."
                );
                hasMoreFiles = false;
            } else {
                // Click the Next button and wait for the UI to update
                await nextButton.click();
                debug("Clicked Next button");
                await page.waitForTimeout(1000); // Wait for UI to update

                // Wait for the new file to be displayed
                await page.waitForSelector(
                    "text=/Currently Viewing: .+\.dcm/",
                    {
                        state: "visible",
                        timeout: 5000,
                    }
                );
            }
            if (!DEBUG) {
                process.stdout.write(". ");
            }
        }

        // This log is important enough to keep even when debugging is off
        console.log(`Successfully checked ${fileCount} files`);
    } catch (error) {
        // Always log errors regardless of debug setting
        console.error("Test failed:", error);
        throw error;
    }
});
