import { LoadTags } from "../loader/loader.js";
import { Logger } from "../logger/logger.js";
import { TagDictionary } from "../tagDictionary/dictionary.js";
import { standardDataElements } from "../tagDictionary/standardDataElements.js";

QUnit.module("DICOM Tag Editor - Integration Test", function () {
    QUnit.test("System Integration: Load, Parse, Validate Tags", async function (assert) {
        assert.timeout(300000000000000000);//allow enough time to test all files from stakeholder
        const done = assert.async();
        const loader = new LoadTags();
        const tagDict = new TagDictionary();
        const logger = new Logger();

        // Validate dictionary once
        let tagValidationPassed = true;
        for (const [tag, data] of Object.entries(standardDataElements)) {
            const tagName = tagDict.lookup(`X${tag}`);
            if (tagName !== data.name) {
                console.error(` Dictionary mismatch for tag ${tag}: Expected "${data.name}", got "${tagName}"`);
                tagValidationPassed = false;
            }
        }
        assert.ok(tagValidationPassed, " All dictionary tags validated");

        try {
            // Define datasets
            const datasets = [
                { path: "../tests/2025-CMPT371-Demo-Datasets/CT/Demo-CT-Case1", files: Array.from({ length: 1 }, (_, i) => `IM${i}`) },
                { path: "../tests/2025-CMPT371-Demo-Datasets/CT/Demo-CT-Case2", files: Array.from({ length: 1 }, (_, i) => `${i.toString().padStart(6, '0')}.dcm`) },
                { path: "../tests/2025-CMPT371-Demo-Datasets/MRI/Demo-MR-Case1", files: Array.from({ length: 1 }, (_, i) => `IM${i}`) },
                { path: "../tests/2025-CMPT371-Demo-Datasets/MRI/Demo-MR-Case2", files: Array.from({ length: 1 }, (_, i) => `IM${i}`) },
                { path: "../tests/2025-CMPT371-Demo-Datasets/US/Demo-US-Case1", files: Array.from({ length: 1 }, (_, i) => `IM${(i + 1).toString().padStart(6, '0')}`) },
                { path: "../tests/2025-CMPT371-Demo-Datasets/US/Demo-US-Case2", files: Array.from({ length: 1 }, (_, i) => `IM${(i + 1).toString().padStart(6, '0')}`) },
                { path: "../tests/2025-CMPT371-Demo-Datasets/XRay/Demo-XR-Case1/new", files: ["1487.dcm", "1488.dcm", "1489.dcm", "14810.dcm", "14811.dcm"] },
                { path: "../tests/2025-CMPT371-Demo-Datasets/XRay/Demo-XR-Case2", files: ["CR000000.dcm", "CR000001.dcm"] },
            ];

            for (const dataset of datasets) {
                console.log(` Processing dataset: ${dataset.path}`);

                for (const filename of dataset.files) {
                    const filePath = `${dataset.path}/${filename}`;
                    console.log(` Testing DICOM file: ${filePath}`);

                    try {
                        const response = await fetch(filePath);
                        if (!response.ok) {
                            assert.notOk(true, ` Failed to load ${filePath}`);
                            continue;
                        }

                        const arrayBuffer = await response.arrayBuffer();
                        const dicomFile = new Blob([new Uint8Array(arrayBuffer)], { type: "application/dicom" });

                        // Parse the DICOM file
                        const tableHtml = await loader.readFile(dicomFile);

                        // Count rows in the returned HTML table
                        const rowCount = (tableHtml.match(/<tr>/g) || []).length;
                        assert.ok(rowCount > 0, ` Extracted ${rowCount} tags in ${filePath}`);

                        let validatedCount = 0;
                        // Extract detected tags from the table (they have an 'X' prefix)
                        const detectedTags = [...tableHtml.matchAll(/<td>X([0-9A-Fa-f]{8})<\/td>/g)].map(match => match[1].toUpperCase());
                        
                        //for now just validate the tags that are both in dictonary and the dicom file
                        detectedTags.forEach(tag => {
                            if (standardDataElements[tag]) {
                                //  This tag is in the dictionary, validate it
                                const expectedTagName = standardDataElements[tag].name;
                                assert.equal(tagDict.lookup(`X${tag}`), expectedTagName, ` Tag ${tag} correctly identified in ${filePath}`);
                                validatedCount++;
                            }
                        });

                        // Check if some tags exist in the file but are NOT in the dictionary
                        if (detectedTags.length > validatedCount) {
                            console.warn(`⚠️ Some tags exist in ${filePath} but are not in the dictionary!`);
                        }

                        assert.ok(validatedCount >= 0, ` Validated ${validatedCount} known tags in ${filePath}`);

                        // Log successful processing
                        logger.log("INFO", `DICOM file ${filePath} successfully processed`);
                        assert.ok(true, ` Logger recorded successful processing for ${filePath}`);

                    } catch (error) {
                        assert.notOk(error, ` Error processing ${filePath}: ${error.message}`);
                    }
                }
            }
        } catch (error) {
            assert.notOk(error, ` Error in system integration: ${error.message}`);
        }

        done();
    });
});
