import { LoadTags } from "../loader/loader.js"

QUnit.module("loader")

QUnit.test("loader test", (assert) => {
    const loadTags = new LoadTags()

    assert.equal(loadTags.dataSet, null, "dataSet is null")
    assert.equal(loadTags.table, "", "table is an empty string")
    assert.notStrictEqual(loadTags.createTagTableRow("0X00080008", "Image Type", "DERIVED\\PRIMARY\\AXIAL"), "\n        <tr>\n            <td>0X00080008</td>\n            <td>Image Type</td>\n            <td>\n                <input type=\"text\" value=\"DERIVED\\PRIMARY\\AXIAL\" oninput=\"dataSet.elements['0x00080008'].data = dicomParser.stringToBytes(this.value)\" />\n            </td>\n        </tr>", "createTagTableRow returns the correct HTML string")
   
})

