import { Logger } from "../logger/logger.js"

QUnit.module("logger")

QUnit.test("logger test", (assert) => {
    const logger = new Logger()

    assert.equal(logger.handle, null, "handle is null")
    assert.equal(
        logger.postUrl,
        "https://us-central1-data-a9e6d.cloudfunctions.net/app/add/msg",
        "postUrl is correct"
    )
    // assert.equal(logger.pickHandle(), undefined);
    // assert.equal(logger.localLog("INFO", "Parsing DICOM file"), undefined);
    // assert.equal(logger.closeFile(), undefined);
    // assert.equal(logger.log("INFO", "Parsing DICOM file"), undefined);

    // assert.equal(await logger.logMessage("TEST", "Test function"), { status: "success" });
})

QUnit.test("logger test", async (assert) => {
    const logger = new Logger()
    logger.logMessage("TEST", "Parsing DICOM file", "Test Runner")
    // return logger.logMessage("TEST", "Test function").then(data => {
    //     assert.equal(data, { status: "success" }, "Passed!");
    // });
    assert.equal(logger.handle, null, "handle is null")
})
