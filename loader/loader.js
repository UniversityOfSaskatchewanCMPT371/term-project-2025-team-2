// Ensure dicomParser is loaded before use
let dicomParser = window.dicomParser;
if (!dicomParser) {
    console.warn("⏳ Waiting for dicomParser to load...");
    await import("https://unpkg.com/dicom-parser@1.8.3/dist/dicomParser.min.js");
    dicomParser = window.dicomParser;

    if (!dicomParser) {
        throw new Error(" Failed to load dicomParser. Ensure it's included in index.html.");
    }
}

import { TagDictionary } from "../tagDictionary/dictionary.js";

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
        this.logger = null;
        this.table = "";
        this.modifiedTags = new Map();
    }

    async initLogger() {
        if (!this.logger) {
            try {
                const module = await import("../script.js");
                this.logger = module.logger;
            } catch (error) {
                console.error(" Failed to load logger:", error);
            }
        }
    }

    parseDicom(uint8Array) {
        this.initLogger();

        if (!dicomParser || typeof dicomParser.parseDicom !== "function") {
            throw new Error(" dicomParser is not available. Ensure it's included in index.html.");
        }

        try {
            console.log("Parsing DICOM file...");
            this.dataSet = dicomParser.parseDicom(uint8Array);

            if (!this.dataSet || !this.dataSet.elements) {
                throw new Error(" Failed to parse DICOM file: dataset is undefined.");
            }

            console.log("DICOM file parsed successfully!");
        } catch (error) {
            if (this.logger) {
                this.logger.log("ERROR", error.message);
            }
            console.error(" Error parsing DICOM file:", error);
            throw error;

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
        <tr id="tag-row">
            <td id="tag">${tag.toUpperCase()}</td>
            <td id="tag-name">${tagName}</td>
            <td>
                <input id="tag-value" type="text" value="${tagValue}" />
            </td>
        </tr>
        `;
    }


    /**
     * Create the table of DICOM tags.
     * @returns {void}
     */
    createTagTable() {
        if (!this.dataSet || !this.dataSet.elements) {
            console.error(" No valid DICOM dataset found.");
            return "";
        }

        this.table = ""; // Reset table

        Object.keys(this.dataSet.elements).forEach((tag) => {
            const formattedTag = tag.toUpperCase();
            const tagName = this.tagDictionary.lookup(formattedTag) || "Unknown";
            const tagValue = this.dataSet.string(tag) || "N/A";

            if (tagName === "Unknown") {
                this.logger.log("WARNING", `Unknown DICOM tag: ${formattedTag}`);
            }

            this.table += this.createTagTableRow(formattedTag, tagName, tagValue);
        });

        console.log("DICOM Tag Table Generated Successfully!");
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
    async readFile(file) {
        await this.initLogger();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const uint8Array = new Uint8Array(arrayBuffer);

                    this.parseDicom(uint8Array);
                    this.createTagTable(); // Generate the table after parsing

                    resolve(this.getTable()); // Return table HTML
                } catch (error) {
                    console.error(" Error reading DICOM file:", error);
                    reject(error);
                }
            };

            reader.onerror = (error) => {
                console.error(" File reading error:", error);
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    }


    // not a goog way to do this
    updateTagValue() {
        if (!this.dataSet) return;

        const input = document.querySelectorAll("#tag-row");

        input.forEach((item) => {
            const tag = item.children[0].textContent;
            const newValue = item.children[2].children[0].value;
            this.modifiedTags.set(tag, newValue);
        });
    }


    // doesn't work for all formats
    downloadModifiedDicom() {
        if (!this.dataSet) return;

        this.updateTagValue();
        console.log("Modified Tags", this.modifiedTags);

        // Create a modified copy of the original DICOM data
        const modifiedDataset = new Uint8Array(this.dataSet.byteArray);

        // Apply modifications
        this.modifiedTags.forEach((tag, newValue) => {
            //console.log(newValue);
            const element = this.dataSet.elements[newValue.toLowerCase()];
            if (element) {
                // This is a simplified approach - in practice, you'd need proper VR handling
                const encoder = new TextEncoder();
                const valueBytes = encoder.encode(tag);
                
                valueBytes.forEach((byte, index) => {
                    if (index < element.length) {
                        modifiedDataset[element.dataOffset + index] = byte;
                    }
                });
            }
        });
       // console.log("Modified Dataset", modifiedDataset);

        // Create and trigger download
        const blob = new Blob([modifiedDataset], { type: 'application/dicom' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modified.dcm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }


}

