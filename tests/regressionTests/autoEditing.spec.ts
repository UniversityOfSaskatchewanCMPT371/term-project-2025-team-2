import { test, expect } from "@playwright/test";
import * as fs from "fs";

// import { TagsAnon } from "@auto/TagsAnon";

import AdmZip from "adm-zip";
import { promisify } from "util";

import * as path from "path";
import { fileURLToPath } from "url";

const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

const DEBUG = process.env.DEBUG_TESTS === "true" || false;

const debug = (message: string) => {
    if (DEBUG) {
        console.log(message);
    }
};

const tagsanon = [
    "InstitutionName",
    "InstitutionAddress",
    "ReferringPhysicianName",
    "PerformingPhysicianName",
    "NameOfPhysiciansReadingStudy",
    "OperatorsName",
    "PatientName",
    "AdditionalPatientHistory",
    "OtherPatientIDs",
    "OtherPatientNames",
    "ClinicalTrialSponsorName",
    "ClinicalTrialSiteName",
    "ClinicalTrialCoordinatingCenterName",
    "ClinicalTrialProtocolEthicsCommitteeName",
    "ClinicalTrialProtocolEthicsCommitteeApprovalNumber",
    "EvaluatorName",
    "OrderCallbackPhoneNumber",
];

test("Edit tags in MRI series", async ({ page }) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        await page.goto(BASE_URL);

        const dicomDir = "./test-data/test_dicoms/gen_dicom_files";
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
            timeout: 5000,
        });

        const tagRow = page
            .locator("tr", {
                has: page.locator("td", { hasText: "PatientName" }),
            })
            .first();

        await expect(tagRow).toBeVisible({ timeout: 1000 });

        const downloadPromise = page.waitForEvent("download");

        const autoAnonButton = page.getByRole("button", { name: /Auto Anon/i });
        await expect(autoAnonButton).toBeVisible({ timeout: 1000 });
        await autoAnonButton.click();

        const okAnonButton = page.getByRole("button", { name: /OK/i });
        await expect(okAnonButton).toBeVisible({ timeout: 1000 });
        await okAnonButton.click();

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

        const no1Button = page.locator("id=no");
        await expect(no1Button).toBeVisible();
        await no1Button.click();

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

            for (const tag of tagsanon) {
                const row = page
                    .locator("tr", {
                        has: page.locator("td", { hasText: tag }),
                    })
                    .first();

                await expect(row).toBeVisible({ timeout: 20000 });

                const rowValue = await row.locator("td").nth(2).textContent();

                debug(`File ${fileCount} - ${tag}: ${rowValue}`);

                expect(rowValue).toContain("ANONYMOUS");

                if (!DEBUG) {
                    process.stdout.write(". ");
                }
            }

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

                // Wait for the new file to be displayed
                await page.waitForSelector(
                    "text=/Currently Viewing: .+\.dcm/",
                    {
                        state: "visible",
                        timeout: 2000,
                    }
                );
            }
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
