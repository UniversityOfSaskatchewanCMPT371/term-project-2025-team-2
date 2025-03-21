import dicomParser from "dicom-parser";
import { TagDictionary } from "../TagDictionary/dictionary";
import logger from "@logger/Logger";
import { assert } from "../assert";
import { DicomData, DicomTags } from "@dicom//Types/DicomTypes";
import { useStore } from "@state/Store";
import { standardDataElements } from "../TagDictionary/standardDataElements";

const tagDictionary = new TagDictionary();

// List of tags to hide from the user interface
const hiddenTags = ["X0025101B", "X00431029", "X0043102A", "X7FE00010"];

/**
 * Parse a DICOM file and extract its tags
 * @description Reads and parses a DICOM file, extracting its tags into a structured format
 * @precondition The file parameter must be a valid File object containing DICOM-formatted data
 * @postcondition A Promise is returned that resolves to a DicomData object containing the parsed tags and dataset
 * @param {File} file - DICOM file to be parsed
 * @returns {Promise<DicomData>} Promise that resolves with the parsed DICOM data including tags and original dataset
 * @throws {Error} If the file cannot be read as an ArrayBuffer
 * @throws {Error} If the DICOM parsing fails due to invalid or corrupted DICOM data
 */
export const parseDicomFile = (file: File): Promise<DicomData> => {
    logger.info("Parsing DICOM file: ", file.name);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result instanceof ArrayBuffer) {
                try {
                    const dataSet = dicomParser.parseDicom(
                        new Uint8Array(e.target.result)
                    );
                    const dicomData = extractDicomTags(dataSet);
                    resolve(dicomData);
                } catch (error) {
                    logger.error("Error parsing DICOM file: ", error);
                    reject("Error parsing DICOM file: " + error);
                }
            } else {
                logger.error(
                    "Invalid file format: Could not read file as ArrayBuffer."
                );
                reject(
                    "Invalid file format: Could not read file as ArrayBuffer."
                );
            }
        };
        reader.onerror = () => reject("File reading error occurred.");
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Get a human-readable tag name from a tag ID
 * @param tagId The DICOM tag ID in format "ggggeeee"
 * @returns The human-readable tag name or "Unknown" if not found
 */
export function getTagName(tagId: string): string {
    // Get the tag dictionary from the store
    const tagDictionary = useStore.getState().tagDictionary;
    const isTagDictionaryLoaded = useStore.getState().isTagDictionaryLoaded;

    // If dictionary isn't loaded, return "Loading..." and trigger load in background
    if (!isTagDictionaryLoaded) {
        // Start loading the dictionary in the background for future calls
        useStore.getState().loadTagDictionary();
        // For standardDataElements, try to get name from there
        // const standardElements = require("../TagDictionary/standardDataElements").standardDataElements;
        if (standardDataElements && standardDataElements[tagId]) {
            return standardDataElements[tagId].name.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
        }
        return "Loading...";
    }

    // Find the tag in the dictionary
    const tagInfo = tagDictionary.find((tag) => tag.tagId === tagId.slice(1));

    // Return the tag name if found, otherwise return "Unknown"
    return tagInfo ? tagInfo.name : "Unknown";
}

/**
 * Get a value representation (VR) for a tag
 * @param tagId The DICOM tag ID in format "ggggeeee"
 * @returns The VR code (e.g., "CS", "LO", "PN", etc.) or "UN" if not found
 */
export async function getTagVR(tagId: string): Promise<string> {
    // Get the tag dictionary from the store
    const tagDictionary = useStore.getState().tagDictionary;
    const isTagDictionaryLoaded = useStore.getState().isTagDictionaryLoaded;
    const loadTagDictionary = useStore.getState().loadTagDictionary;

    // If tag dictionary isn't loaded yet, load it
    if (!isTagDictionaryLoaded) {
        await loadTagDictionary();
    }

    // Find the tag in the dictionary
    const tagInfo = tagDictionary.find((tag) => tag.tagId === tagId.slice(1));

    // Return the tag VR if found, otherwise return "UN" (Unknown)
    return tagInfo?.vr || "UN";
}

/**
 * Extract DICOM tags from a parsed dataset
 * @description Extracts and organizes DICOM tag information from a parsed dataset into a structured format
 * @precondition The dataSet parameter must be a valid dicomParser.DataSet object with elements property
 * @postcondition A DicomData object is returned containing structured tag information and the original dataset
 * @param {dicomParser.DataSet} dataSet - DICOM dataset parsed using dicom-parser
 * @returns {DicomData} Object containing the extracted DICOM tags (tags) and original dataset (DicomDataSet)
 * @throws {AssertionError} If no DICOM tags are found in the dataset
 */
export const extractDicomTags = (dataSet: dicomParser.DataSet): DicomData => {
    logger.info("Extracting DICOM tags from dataset.");
    logger.debug("Data set:", dataSet);

    const dicomTags: DicomTags = {};
    if (!dataSet || !dataSet.elements) {
        logger.warn("Invalid DICOM dataset: No elements found.");
        return { tags: dicomTags, DicomDataSet: dataSet };
    }

    Object.keys(dataSet.elements).forEach((tag: string) => {
        const element = dataSet.elements[tag];
        const tagId = tag.toUpperCase();
        // const tagName = tagDictionary.lookupTagName(tagId) || "Unknown Tag";
        const tagName = getTagName(tagId);
        let vr = element.vr;
        const vrTagDict = tagDictionary.lookupTagVR(tagId);
        if (!vr) {
            // If VR is not found, use the VR from the dictionary
            vr = vrTagDict;
            logger.debug(
                `VR not found for tag "${tagId}". Using VR from dictionary: ${vr}`
            );
        }

        let value: number | string;

        try {
            switch (vr) {
                case "UL":
                    value = dataSet.uint32(tag)?.toString() || "N/A";
                    break;
                case "OB":
                    if (
                        element.dataOffset !== undefined &&
                        element.length !== undefined
                    ) {
                        value =
                            dataSet.byteArray
                                ?.slice(
                                    element.dataOffset,
                                    element.dataOffset + element.length
                                )
                                ?.toString() || "N/A";
                    } else {
                        value = "N/A";
                    }
                    break;
                case "FD":
                    value = dataSet.double(tag)?.toString() || "N/A";
                    break;
                case "US":
                    value = dataSet.uint16(tag)?.toString() || "N/A";
                    break;
                default:
                    value = dataSet.string(tag) || "N/A";
                    break;
            }
        } catch (error) {
            logger.warn(`Error reading tag "${tagId}" with VR "${vr}":`, error);
            value = "Error reading value";
        }

        if (element.items && element.items.length > 0) {
            const nestedTags = element.items
                .map((item) =>
                    item.dataSet ? extractDicomTags(item.dataSet) : null
                )
                .filter((item) => item !== null);

            dicomTags[tagId] = { tagId, tagName, value: nestedTags };
        } else if (hiddenTags.includes(tagId)) {
            dicomTags[tagId] = { tagId, tagName, value, hidden: true };
        } else {
            dicomTags[tagId] = { tagId, tagName, value };
        }
    });

    assert(
        Object.keys(dicomTags).length > 0,
        "No DICOM tags found in dataset."
    );

    return { tags: dicomTags, DicomDataSet: dataSet };
};
