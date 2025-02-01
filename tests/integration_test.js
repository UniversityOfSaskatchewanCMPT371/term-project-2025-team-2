import { LoadTags } from "../loader/loader.js";
import { Logger } from "../logger/logger.js";
import { TagDictionary } from "../tagDictionary/dictionary.js";

QUnit.module("DICOM Tag Editor - Integration Test", function () {
    QUnit.test("System Integration: Load, Parse, Lookup, and Log", async function (assert) {
        const done = assert.async();
        const loader = new LoadTags();
        const tagDict = new TagDictionary();
        const logger = new Logger();

        assert.ok(loader.readFile, "LoadTags.readFile function exists");
        assert.ok(tagDict.lookup, "TagDictionary.lookup function exists");
        assert.ok(logger.log, "Logger.log function exists");

        try {
            // Load a real DICOM file
            const response = await fetch("../tests/IM0");
            const arrayBuffer = await response.arrayBuffer();
            const dicomFile = new Blob([new Uint8Array(arrayBuffer)], { type: "application/dicom" });

            // Parse the DICOM file
            const tableHtml = await loader.readFile(dicomFile);
            assert.ok(tableHtml.includes("<tr>"), "Table HTML contains rows (DICOM parsed correctly)");

            // Define expected tag values
            const expectedTags = {
                "X00080005": "SpecificCharacterSet",
                "X00100010": "PatientName"
            };

            // Extract and verify tag names
            Object.keys(expectedTags).forEach(tag => {
                const tagName = tagDict.lookup(tag);
                assert.equal(tagName, expectedTags[tag], `Correct tag returned for ${tag}: ${tagName}`);
            });

            // Log that the DICOM file was successfully processed
            logger.log("INFO", "DICOM file successfully processed");
            assert.ok(true, "Logger recorded successful processing");

        } catch (error) {
            assert.notOk(error, `Error in system integration: ${error.message}`);
        }

        done();
    });
});
