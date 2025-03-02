import { test, expect } from "@playwright/test";
import fs from "fs";
import dicomParser from "dicom-parser";
import { standardDataElements } from "../../../src/tagDictionary/standardDataElements";

/**
 * Extracts DICOM value from particular tag in a dataSet
 * return: string of value or "N/A"
 * SE: console warning if erro extracting value
 */
function extractDicomValue(dataSet: any, tag: string): string {
    let value: string | undefined = dataSet.string(tag);

    if (value === undefined) {
        try {
            if (dataSet.uint16(tag) !== undefined) {
                value = dataSet.uint16(tag).toString();
            } else if (dataSet.uint32(tag) !== undefined) {
                value = dataSet.uint32(tag).toString();
            } else if (dataSet.float(tag) !== undefined) {
                value = dataSet.float(tag).toString();
            }
        } catch (error) {
            console.warn(`Error extracting value for tag ${tag}:`, error);
        }
    }
    return value ?? "N/A";
}

/**
 * Reads a DICOM file path and extracts expected tag names and values
 * return: record of expected DICOM data objects (tagId, tagName, value)
 * postcond: (1) tags will not have 'x' preffix, (2) tagName may be "Unknown"
 */
function readDicomData(dicomFilePath: string) {
    // Read the DICOM file into a buffer
    const dicomBuffer = fs.readFileSync(dicomFilePath);
    const dataSet = dicomParser.parseDicom(new Uint8Array(dicomBuffer));

    // Extract expected DICOM data
    const expectedDicomData: Record<
        string,
        { tagId: string; tagName: string; value: string }
    > = {};

    Object.keys(dataSet.elements).forEach((tag) => {
        const cleanTagId = tag.toUpperCase().replace(/^X/, ""); // clean up tag id
        const tagName = standardDataElements[cleanTagId]?.name ?? "Unknown";
        const value = extractDicomValue(dataSet, tag);
        expectedDicomData[cleanTagId] = { tagId: cleanTagId, tagName, value };
    });
    return expectedDicomData;
}

// ***** SYSTEM TEST for upload DICOM file to parse to display *****
// compares html table contents to input file data
test("DICOM Table Data Matches Expected Tag Names and Values", async ({
    page,
}) => {
    // Read and Parse test_dicom1.dcm DICOM File
    const dicomFilePath = "test-data/test_dicoms/test_dicom1.dcm";
    const expectedDicomData = readDicomData(dicomFilePath);

    // Launch the DICOM Web App
    await page.goto("http://localhost:5173");

    // Upload the DICOM File
    const fileInput = await page.locator("input[type='file']").nth(0);
    await fileInput.setInputFiles(dicomFilePath);

    // Extract Table Data
    await page.waitForSelector("table");

    // Compare Expected vs Displayed Values
    for (const tagId in expectedDicomData) {
        const expectedTag = expectedDicomData[tagId];

        // Locate the correct table row by tag ID
        const tagRow = await page.locator(`table tr:has-text("${tagId}")`);

        // Locate the tag name and value columns
        const tagNameCell = await tagRow.locator("td:nth-child(2)"); // Second column (Tag Name)
        const valueCell = await tagRow.locator("td:nth-child(3)"); // Third column (Tag Value)

        // Validate tag name and value
        await expect(tagNameCell).toContainText(expectedTag.tagName);
        await expect(valueCell).toContainText(expectedTag.value);
    }
});
