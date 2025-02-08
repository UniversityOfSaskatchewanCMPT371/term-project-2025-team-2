import dicomParser from "dicom-parser";
import { TagDictionary } from "../../tagDictionary/dictionary";

const tagDictionary = new TagDictionary();

/**
 *
 * @param dataSet - DICOM data set, parsed using dicom-parser
 * @returns dicomTags - Object containing the extracted DICOM tags
 */
const extractDicomTags = (dataSet: any) => {
    const dicomTags: any = {};

    Object.keys(dataSet.elements).forEach((tag: any) => {
        const element = dataSet.elements[tag];
        const tagId = tag.toUpperCase();
        const tagName = tagDictionary.lookup(tagId) || "Unknown Tag";
        const value = dataSet.string(tag) || "N/A";

        if (element.items && element.items.length > 0) {
            const valueNested: any = [];

            Object.keys(element.items[0].dataSet.elements).forEach(
                (nestedTag: any) => {
                    const nestedTagId = nestedTag.toUpperCase();
                    const nestedTagName =
                        tagDictionary.lookup(nestedTagId) || "Unknown Tag";
                    const nestedValue =
                        element.items[0].dataSet.string(nestedTag) || "N/A";

                    valueNested.push({
                        tagId: nestedTagId,
                        tagName: nestedTagName,
                        value: nestedValue,
                    });
                }
            );
            dicomTags[tagId] = { tagId, tagName, value: valueNested };
        } else {
            dicomTags[tagId] = { tagId, tagName, value };
        }
    });

    return dicomTags;
};

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
            }
        };
        reader.readAsArrayBuffer(file);
    });
};