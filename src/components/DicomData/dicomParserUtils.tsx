import dicomParser from "dicom-parser";
import { TagDictionary } from "../../tagDictionary/dictionary";

const tagDictionary = new TagDictionary();

export const extractDicomTags = (dataSet: any) => {
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

export const parseDicomFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result instanceof ArrayBuffer) {
                const arrayBuffer = e.target.result;
                const uint8Array = new Uint8Array(arrayBuffer);

                //Check if the file contains "DICM" at byte 128-131
                const dicmHeader = new TextDecoder().decode(uint8Array.slice(128, 132));
                if (dicmHeader !== "DICM") {
                    reject("Error: File does not contain a valid DICOM magic number (DICM).");
                    return;
                }

                try {
                    //Parse the DICOM file
                    const dataSet = dicomParser.parseDicom(uint8Array);
                    const dicomData = extractDicomTags(dataSet);
                    resolve(dicomData);
                } catch (error) {
                    reject("Error parsing DICOM file: " + error);
                }
            }
        };

        reader.onerror = () => {
            reject("Error reading file.");
        };

        reader.readAsArrayBuffer(file);
    });
};
