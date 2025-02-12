import dicomParser from "dicom-parser";
import { TagDictionary } from "../../tagDictionary/dictionary";

const tagDictionary = new TagDictionary();

const hiddenTags = ["X0025101B", "X00431029", "X0043102A", "X7FE00010"];

/**
 *
 * @param file - DICOM file
 * @returns - Promise that resolves with the parsed DICOM data
 * @description - Parses a DICOM file and extracts the DICOM tags
 */
export const parseDicomFile = (file: File): Promise<any> => {
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
                    reject("Error parsing DICOM file: " + error);
                }
            } else {
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
const extractDicomTags = (dataSet: any) => {
    const dicomTags: any = {};
    if (!dataSet || !dataSet.elements) {
        console.warn("Invalid DICOM dataset: No elements found.");
        return dicomTags;
    }

    Object.keys(dataSet.elements).forEach((tag: any) => {
        const element = dataSet.elements[tag];
        const tagId = tag.toUpperCase();
        const tagName = tagDictionary.lookup(tagId) || "Unknown Tag";
        const vr = element.vr;

        let value: any;

        switch (vr) {
            case "UL":

                if (dataSet.elements[tag]) {
                    value = dataSet.uint32(tag);
                } else {
                    value = "N/A";
                }

                break;
            case "OB":
                value = dataSet.byteArray
                    .slice(
                        element.dataOffset,
                        element.dataOffset + element.length
                    )
                    .toString();
                break;
            default:
                value = dataSet.string(tag) || "N/A";
                break;
        }


        if (element.items && element.items.length > 0) {
            const nestedTags = extractDicomTags(element.items[0].dataSet);

            dicomTags[tagId] = { tagId, tagName, value: nestedTags };
        } else if (hiddenTags.includes(tagId)) {
            dicomTags[tagId] = { tagId, tagName, value: value, hidden: true };
        } else {
            dicomTags[tagId] = { tagId, tagName, value };
        }
    });

    return dicomTags;
};
