
let dicomParser
if (typeof document != "undefined") {
    dicomParser = window.dicomParser
} else {
    dicomParser = "undefined"
}

import { TagDictionary } from "../tagDictionary/dictionary.js"

/**
 * LoadTags class to handle the loading and parsing of DICOM files.
 * @class
 */
export class LoadTags {

    /**
     * Constructor for the LoadTags class.
     * @constructor
     * 
     */
    constructor() {
        this.dataSet = null;
        this.tagDictionary = new TagDictionary();
        this.table = "";
    }

    /**
     * Parse the DICOM file using dicomParser.
     * @param {Uint8Array} uint8Array - The Uint8Array representation of the DICOM file.
     * @returns {void}
     */
    parseDicom(uint8Array) {

        console.log("Parsing DICOM file...");
        this.dataSet = dicomParser.parseDicom(uint8Array);

        // Check if parsing succeeded
        if (!this.dataSet) {
            throw new Error("Failed to parse DICOM file: dataset is undefined.");
        }

    }

    /**
     * Create a table row for a DICOM tag.
     * @param {string} tag - The DICOM tag.
     * @param {string} tagName - The name of the DICOM tag.
     * @param {string} tagValue - The value of the DICOM tag.
     * @returns {string} - The HTML string for the table row.
     * @example
     * createTagTableRow(0x00080008, "Image Type", "DERIVED\\PRIMARY\\AXIAL")
     * // Returns: "<tr><td>0x00080008</td><td>Image Type</td><td><input type="text" value="DERIVED\\PRIMARY\\AXIAL" oninput="dataSet.elements['0x00080008'].data = dicomParser.stringToBytes(this.value)" /></td></tr>"
     */
    createTagTableRow(tag, tagName, tagValue) {
        return `
        <tr>
            <td>${tag.toString(16).toUpperCase()}</td>
            <td>${tagName}</td>
            <td>
                <input type="text" value="${tagValue}" oninput="dataSet.elements['${tag}'].data = dicomParser.stringToBytes(this.value)" />
            </td>
        </tr>
        `;
    }

    /**
     * Create the table of DICOM tags.
     * @returns {void}
     */
    createTagTable() {
        this.table = ""; // Reset table contents before filling

        Object.keys(this.dataSet.elements).forEach((tag) => {
            const tagName = this.tagDictionary.lookup(
                `${tag.toString(16).toUpperCase()}`
            );

            if (tagName === "Unknown") {
                console.log("ERROR", `Unknown tag: ${tag.toString(16).toUpperCase()}`);
            }

            const tagValue = this.dataSet.string(tag) || "N/A"; // Default to 'N/A' if no value is found
            this.table += this.createTagTableRow(tag, tagName, tagValue);
        });
    }

    /**
     * Get the table of DICOM tags.
     * @returns {string} - The HTML string of the table.
     */
    getTable() {
        return this.table;
    }

    /**
     * Load and parse a DICOM file.
     * @param {File} file - The DICOM file to be loaded.
     * @returns {Promise<string>} - The promise containing the table HTML.
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const uint8Array = new Uint8Array(arrayBuffer);

                    this.parseDicom(uint8Array); // Parse the DICOM data
                    this.createTagTable(); // Create the tag table

                    resolve(this.getTable()); // Resolve the promise with the table HTML
                } catch (error) {
                    reject(error); // Reject the promise if there was an error
                }
            };

            reader.onerror = (error) => {
                reject(error); // Reject the promise if the file reading fails
            };

            reader.readAsArrayBuffer(file);
        });
    }
}
