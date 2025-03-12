import { test, expect } from "@playwright/test";
import * as fs from "fs";

import AdmZip from "adm-zip";
import { promisify } from "util";

const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

import * as path1 from "path";
import { fileURLToPath } from "url";

export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

const DEBUG = process.env.DEBUG_TESTS === "true" || false;

const debug = (message: string) => {
    if (DEBUG) {
        console.log(message);
    }
};

test("Edit tag in series", async ({ page }) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path1.dirname(__filename);

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

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles(dicomFiles);

        await page.waitForSelector("text=Edit Files", {
            state: "visible",
            timeout: 5000,
        });

        const yesButton = page.locator("id=yes");
        await expect(yesButton).toBeVisible();
        await yesButton.click();

        await page.waitForSelector("text=/Currently Viewing: .+\.dcm/", {
            state: "visible",
            timeout: 1000,
        });

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 10000,
        });

        const tagRow = page
            .locator("tr", {
                has: page.locator("td", { hasText: "PatientName" }),
            })
            .first();

        await page.waitForSelector("text=Files", {
            state: "visible",
            timeout: 500,
        });

        await expect(tagRow).toBeVisible({ timeout: 1000 });

        const editButton = tagRow.locator("svg.h-6.w-6").first();
        await expect(editButton).toBeVisible();
        await editButton.click();

        const tagInput = tagRow.locator("input").first();
        await expect(tagInput).toBeVisible();
        await tagInput.fill("New Value");

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        await page.waitForSelector(
            'button:has-text("Apply Edits to All Files")',
            {
                state: "visible",
                timeout: 5000,
            }
        );

        const downloadPromise = page.waitForEvent("download");

        await page.click('button:has-text("Apply Edits to All Files")');

        const download = await downloadPromise;

        const zipFilePath = await download.path();

        const path = zipFilePath.split("/");

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

        const extractDir = "/" + path[1] + "/" + path[2] + "/extracted";

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

        const dicomFile = fs
            .readdirSync(extractDir)
            .filter((file) => file.endsWith(".dcm"))
            .map((file) => extractDir + "/" + file);

        if (!dicomFile) {
            throw new Error("No DICOM file found in the extracted zip");
        }

        await fileInput.setInputFiles(dicomFile);

        await page.waitForSelector("text=Edit Files", {
            state: "visible",
            timeout: 5000,
        });

        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 1000,
        });

        let previousFilename = ""; // Variable to track the previous filename
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

            const PatientNameRow = page
                .locator("tr", {
                    has: page.locator("td", { hasText: "PatientName" }),
                })
                .first();

            await expect(PatientNameRow).toBeVisible({ timeout: 5000 });

            const patientNameValue = await PatientNameRow.locator("td")
                .nth(2)
                .textContent();
            debug(`File ${fileCount} - PatientName value: ${patientNameValue}`);

            expect(patientNameValue).toContain("New Value");
            debug(
                `File ${fileCount} - Verified: PatientName contains the new value`
            );

            const PatientIDRow = page
                .locator("tr", {
                    has: page.locator("td", { hasText: "PatientID" }),
                })
                .first();

            await expect(PatientIDRow).toBeVisible({ timeout: 5000 });

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
            debug(`File Count: ${fileCount}`);
            debug(`PatientID value: ${patientIDValue}`);

            const allTdValues =
                await PatientIDRow.locator("td").allTextContents();
            debug(`All TD values in row: ${allTdValues}`);

            debug(`File ${fileCount} - PatientID value: ${patientIDValue}`);
            debug(`File Number: ${fileNumber}`);
            if (patientIDValue == fileNumber) {
                expect(patientIDValue).toContain(fileNumber);
            } else {
                expect(patientIDValue).toContain("NOT ANONYMOUS");
            }

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

                await page.waitForSelector(
                    "text=/Currently Viewing: .+\.dcm/",
                    {
                        state: "visible",
                        timeout: 500,
                    }
                );
            }

            debug(`Filename ${filename}`);
            debug(`Filecount ${fileCount}`);
            debug(`previous filename: ${previousFilename}`);
            previousFilename = filename;

            if (!DEBUG) {
                process.stdout.write(". ");
            }
        }
        console.log(`\nSuccessfully checked ${fileCount} files`);
    } catch (error) {
        console.error("\nTest failed:", error);
        throw error;
    }
});
