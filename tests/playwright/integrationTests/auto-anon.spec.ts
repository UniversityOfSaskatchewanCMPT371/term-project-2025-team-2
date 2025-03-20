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

test("Auto anonymize DICOM file and verify changes", async ({ page }) => {
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
                has: page.locator("td", { hasText: "X00100020" }),
            })
            .first();

        await expect(institutionNameRow).toBeVisible({ timeout: 5000 });

        const downloadPromise = page.waitForEvent("download");

        const autoAnonButton = page.getByRole("button", { name: /Auto Anon/i });
        await expect(autoAnonButton).toBeVisible({ timeout: 5000 });
        await autoAnonButton.click();

        const okAnonButton = page.getByRole("button", { name: /OK/i });
        await expect(okAnonButton).toBeVisible({ timeout: 1000 });
        await okAnonButton.click();

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

        const files = fs.readdirSync(extractDir);
        const dicomFile = files.find((file) => file.endsWith(".dcm"));

        if (!dicomFile) {
            throw new Error("No DICOM file found in the extracted zip");
        }

        await fileInput.setInputFiles(extractDir + "/" + dicomFile);

        await page.waitForSelector("table", {
            state: "visible",
            timeout: 10000,
        });

        const institutionNameRowAfterReupload = page
            .locator("tr", {
                has: page.locator("td", { hasText: "X00100020" }),
            })
            .first();

        await expect(institutionNameRowAfterReupload).toBeVisible({
            timeout: 5000,
        });

        const finalValue = await institutionNameRowAfterReupload
            .locator("td")
            .nth(2)
            .textContent();
        expect(finalValue).toBe("MR0000");

        fs.rmSync(extractDir, { recursive: true, force: true });
    } catch (error) {
        console.error("Test failed:", error);
        throw error;
    }
});
