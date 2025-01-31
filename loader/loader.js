
let dicomParser
if (typeof document != "undefined") {
    dicomParser = window.dicomParser
} else {
    dicomParser = "undefined"
}

import { TagDictionary } from "../tagDictionary/dictionary.js"
import { logger } from "../script.js"


export class LoadTags {
    constructor() {
        this.dataSet = null;
        this.tagDictionary = new TagDictionary();
        this.logger = logger;
        this.table = "";
    }

    // Parse the DICOM file and handle errors
    parseDicom(uint8Array) {
        try {
            console.log("Parsing DICOM file...");
            this.dataSet = dicomParser.parseDicom(uint8Array);

            // Check if parsing succeeded
            if (!this.dataSet) {
                throw new Error("Failed to parse DICOM file: dataset is undefined.");
            }

        } catch (error) {
            this.logger.log("ERROR", error.message);
            throw error;  // Rethrow to be handled in the promise rejection
        }
    }

    // Create the table row HTML for each tag
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

    // Create the tag table from the dataset
    createTagTable() {
        this.table = ""; // Reset table contents before filling

        Object.keys(this.dataSet.elements).forEach((tag) => {
            const tagName = this.tagDictionary.lookup(
                `${tag.toString(16).toUpperCase()}`
            );

            if (tagName === "Unknown") {
                this.logger.log("ERROR", `Unknown tag: ${tag.toString(16).toUpperCase()}`);
            }

            const tagValue = this.dataSet.string(tag) || "N/A"; // Default to 'N/A' if no value is found
            this.table += this.createTagTableRow(tag, tagName, tagValue);
        });
    }

    // Return the table HTML content
    getTable() {
        return this.table;
    }

    // Read the file and return a promise
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
