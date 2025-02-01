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

export class LoadTags {
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

    // Create the table row HTML for each tag
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

    // Generate the tag table from parsed dataset
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

    // Get the table HTML content
    getTable() {
        return this.table;
    }

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

