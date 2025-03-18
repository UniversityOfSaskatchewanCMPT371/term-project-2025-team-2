import { standardDataElements } from "./standardDataElements";
import logger from "@logger/Logger";

/**
 * TagDictionary class
 * This class is used to look up the name of a DICOM tag
 */
export class TagDictionary {
    private dicomTagDictionary: { [key: string]: { vr: string; name: string } };

    /**
     * Constructor for the TagDictionary class
     * @constructor
     */
    constructor() {
        this.dicomTagDictionary = standardDataElements;
    }

    /**
     * lookupTagName - Look up the name of a DICOM tag from its tag number
     * @param {string} tag
     * @returns {string} The name of the DICOM tag or Unknown if not found
     */
    lookupTagName(tag: string): string {
        let tagName: string;
        try {
            tagName = this.dicomTagDictionary[tag.slice(1)].name;
        } catch {
            logger.debug(`Tag ${tag} not found in dictionary`);
            tagName = "Unknown";
        }

        return tagName;
    }

    /**
     * lookupTagVR - Look up the VR (Value Representation) of a DICOM tag from its tag number
     * @param {string} tag
     * @returns {string} The VR of the DICOM tag or Unknown if not found
     */
    lookupTagVR(tag: string): string {
        let tagVR: string;
        try {
            tagVR = this.dicomTagDictionary[tag.slice(1)].vr;
        } catch {
            logger.debug(`Tag ${tag} not found in dictionary`);
            tagVR = "Unknown";
        }

        return tagVR;
    }
}
