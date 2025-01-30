import { standardDataElements } from "./standardDataElements.js"

/**
 * TagDictionary class
 * This class is used to look up the name of a DICOM tag
 */
export class TagDictionary {
    /**
     * Constructor for the TagDictionary class
     * @constructor
     */
    constructor() {
        this.dicomTagDictionary = standardDataElements
        // this.dicomTagDictionary = {
        //     X00080005: "Specific Character Set",
        //     X00080008: "Image Type",
        //     X00080012: "Instance Creation Date",
        //     X00080013: "Instance Creation Time",
        //     X00080018: "SOP Instance UID",
        //     X00080020: "Study Date",
        //     X00080030: "Study Time",
        //     X00080050: "Accession Number",
        //     X00080060: "Modality",
        //     X00080070: "Manufacturer",
        //     X00080090: "Referring Physician's Name",
        //     X00081010: "Station Name",
        //     X00081030: "Study Description",
        //     X0008103E: "Series Description",
        //     X00081190: "Private Creator",
        //     X00100010: "Patient's Name",
        //     X00100020: "Patient ID",
        //     X00100030: "Patient's Birth Date",
        //     X00100040: "Patient's Sex",
        //     X0020000D: "Study Instance UID",
        //     X0020000E: "Series Instance UID",
        //     X00200011: "Image Position (Patient)",
        //     X00200013: "Image Orientation (Patient)",
        //     X00200036: "Flip Angle",
        //     X00280010: "Rows",
        //     X00280011: "Columns",
        //     X00280030: "Pixel Spacing",
        //     X00280100: "Bits Allocated",
        //     X00280101: "Bits Stored",
        //     X00280102: "High Bit",
        //     X00281050: "Window Center",
        //     X00281051: "Window Width",
        //     X00401001: "Requested Procedure Description",
        //     X00402203: "Requested Procedure Priority",
        //     X00404000: "Reason for the Study",
        //     X00451000: "Device Serial Number",
        //     X00540013: "View Position",
        //     X00540022: "View Position ID",
        //     X00540030: "View Position Modifier",
        //     X00540040: "View Modifier",
        //     X00540080: "View Definition",
        //     X00600001: "Patient Position",
        //     X00601004: "View Position Sequence",
        // }
    }

    /**
     * lookup - Look up the name of a DICOM tag from its tag number
     * @param {string} tag
     * @returns
     */
    lookup(tag) {
        let tagName
        try {
            tagName = this.dicomTagDictionary[tag.slice(1)].name
        } catch {
            tagName = "Unknown"
        }

        return tagName
    }
}
