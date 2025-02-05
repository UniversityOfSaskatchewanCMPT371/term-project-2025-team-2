
import { parseDicom as dicomParser } from "../dicomParser/src/parseDicom.js";
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

        if (!dicomParser || typeof dicomParser !== "function") {
            throw new Error(" dicomParser is not available. Ensure it's included in index.html.");
        }

        try {
            console.log("Parsing DICOM file...");
            this.dataSet = dicomParser(uint8Array);

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
        <tr>
            <td>${tag.toUpperCase()}</td>
            <td>${tagName}</td>
            <td>
                <input type="text" value="${tagValue}" oninput="this.dataset.value = this.value" />
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
}

