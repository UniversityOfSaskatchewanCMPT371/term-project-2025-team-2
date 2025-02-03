import { TagDictionary } from "../tagDictionary/dictionary.js"

QUnit.module("Tag Dictionary")

QUnit.test("Tag Dict test", (assert) => {
    const tagDict = new TagDictionary(null)

    assert.equal(
        tagDict.lookup("X00080005"),
        "SpecificCharacterSet",
        "correct tag returned"
    )
    assert.equal(tagDict.lookup("X000000"), "Unknown", "Unknown tag returned")
})
