import dicomParser from "dicom-parser";
import { TagDictionary } from "../TagDictionary/dictionary";
import logger from "@logger/Logger";
import { assert } from "../assert";
import { DicomData, DicomTags} from "@dicom//Types/DicomTypes";

const tagDictionary = new TagDictionary();

const hiddenTags = ["X0025101B", "X00431029", "X0043102A", "X7FE00010"];

/**
 *
 * @param file - DICOM file
 * @returns - Promise that resolves with the parsed DICOM data
 * @description - Parses a DICOM file and extracts the DICOM tags
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
 *
 * @param dataSet - DICOM data set, parsed using dicom-parser
 * @returns dicomTags - Object containing the extracted DICOM tags
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
        const tagName = tagDictionary.lookupTagName(tagId) || "Unknown Tag";
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
                .map((item) => item.dataSet ? extractDicomTags(item.dataSet) : null)
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
