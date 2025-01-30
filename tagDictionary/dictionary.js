import { standardDataElements } from "./standardDataElements.js"

/**
 * TagDictionary class
 * This class is used to look up the name of a DICOM tag
 */
export class TagDictionary {
    /**
     * Constructor for the TagDictionary class
     * @constructor
     */
    constructor() {
        this.dicomTagDictionary = standardDataElements;
    }

    /**
     * lookup - Look up the name of a DICOM tag from its tag number
     * @param {string} tag
     * @returns {string} The name of the DICOM tag or Unknown if not found
     */
    lookup(tag) {

        let tagName
        try {
            tagName = this.dicomTagDictionary[tag.slice(1)].name
        } catch {
            tagName = "Unknown"
        }

        return tagName
    }
}
