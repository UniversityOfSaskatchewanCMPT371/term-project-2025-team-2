/*
 * ISC License
 *
 * Copyright 2017 SDA Team
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

//mset to turn on console logs for debugging
const DEBUG = false;

/**
 * Log debug messages to the console if debugging is enabled
 * @description Conditionally logs messages to the console based on the DEBUG flag
 * @param {string} message - The debug message to log
 * @returns {void} This function doesn't return a value
 */
const debug = (message: string) => {
    if (DEBUG) {
        console.log(message);
    }
};

// DICOM Value Representations (VR) which are numbers
enum NUMBERS {
    "FD",
    "FL",
    "UL",
    "US",
    "SL",
    "SS",
}

// DICOM Value Representations (VR) with 12-byte headers
enum VR_with_12_bytes_header {
    "VR",
    "OB",
    "OD",
    "OF",
    "OL",
    "OW",
    "SQ",
    "UC",
    "UR",
    "UT",
    "UN",
}

// constants for DICOM tag structure
const groupLen = 2;
const elementLen = 2;
const vrLen = 2;
const lengthLen = 2;
const longHeaderLengthLen = 4;
const headerLen = 8;
const longHeaderLen = 12;
const vrOffset = 4;
const lengthOffset = 6;

import dicomParser from "dicom-parser";
import logger from "@logger/Logger";
import { TableUpdateData } from "@dicom//Types/DicomTypes";

export type InsertTag = {
    tagId: string;
    newValue: string;
    vr: string;
    dataOffSet: number;
    length: number;
    delete: boolean;
    add: boolean;
}

/**
 * Update the tags in a DICOM file
 * @description Updates, adds, or removes tags in a DICOM file based on the provided tag data
 * @precondition The dicomData must be a valid DICOM object, newTagData must be a valid array of tag objects
 * @postcondition The dicomData object will be updated with the new tag values
 * @param {Object} dicomData - The parsed DICOM dataset containing elements and byteArray properties
 * @param {Array<Object>} newTagData - Array of tag objects to update, add, or remove
 * @param {string} newTagData[].tagId - The ID of the tag (in format 'xGGGGEEEE')
 * @param {string} newTagData[].newValue - The new value to set for the tag
 * @param {boolean} [newTagData[].delete] - Whether to delete the tag
 * @param {boolean} [newTagData[].add] - Whether to add the tag as new
 * @returns {Uint8Array} Updated DICOM byte array with modified tags
 * @throws {Error} If the file update fails or produces invalid DICOM data
 */
export function tagUpdater(dicomData: dicomParser.DataSet, newTagData: any) {
    const newTags: InsertTag[] = [];
    const newDicomData = dicomData.byteArray;
    const filteredTags = newTagData;
    let data: any;

    if (filteredTags.length === 0) {
        return newDicomData;
    }

    debug("filteredTags: " + JSON.stringify(filteredTags));

    filteredTags.forEach((tag: any) => {
        const insertTag: InsertTag = {
            tagId: tag.tagId,
            newValue: tag.newValue,
            vr: dicomData.elements[tag.tagId.toLowerCase()]?.vr || "ST",
            dataOffSet:
                dicomData.elements[tag.tagId.toLowerCase()]?.dataOffset || 0,
            length: tag.newValue.length,
            delete: tag.delete,
            add: tag.add,
        };
        newTags.push(insertTag);
        debug("insertTag: " + JSON.stringify(insertTag));
    });

    newTags.forEach((tag: InsertTag) => {
        if (tag.delete) {
            data = removeTag(dicomData, tag);
        } else if (tag.add) {
            data = addTag(dicomData, tag);
        } else {
            try {
                const tagIdByte = new Uint8Array(groupLen + elementLen);
                const group = parseInt(tag.tagId.slice(1, 5), 16);
                const element = parseInt(tag.tagId.slice(5), 16);

                tag.dataOffSet =
                    dicomData.elements[tag.tagId.toLowerCase()].dataOffset;

                tagIdByte.set(
                    new Uint8Array([group, group >> 8, element, element >> 8])
                );
                const newTag = createTag(tagIdByte, tag, true);
                data = insertTag(dicomData, tag, newTag);

                debug("newTag: " + JSON.stringify(newTag));
            } catch (error) {
                logger.error(
                    `Tag: ${tag.tagId} doesn't exisit in file ${error}`
                );
            }
        }

        const newData = dicomParser.parseDicom(data);
        dicomData = newData;
    });

    const valid = verifyArrayBuffer(data);

    if (valid) {
        return data;
    }

    throw new Error("File Update Failed");
}

/**
 * Add a new tag to a DICOM file
 * @description Appends a new tag to the end of a DICOM file
 * @precondition The dicomData must be a valid DICOM object with byteArray property, tag must contain valid tag information
 * @postcondition A new byte array will be created with the tag appended to the end
 * @param {Object} dicomData - Raw DICOM dataset with parsed elements
 * @param {Object} tag - Tag information to add to the DICOM file
 * @param {string} tag.tagId - The ID of the tag to add (in format 'xGGGGEEEE')
 * @param {string} tag.vr - Value Representation (VR) code
 * @param {string} tag.value - The value to add for this tag
 * @returns {Uint8Array} Updated byte array with the tag appended
 */
function addTag(dicomData: any, tag: InsertTag) {
    const tagIdByte = new Uint8Array(groupLen + elementLen);
    const group = parseInt(tag.tagId.slice(1, 5), 16);
    const element = parseInt(tag.tagId.slice(5), 16);

    tagIdByte.set(new Uint8Array([group, group >> 8, element, element >> 8]));
    const newTag = createTag(tagIdByte, tag, true);

    const newArray = concatBuffers(dicomData.byteArray, newTag);

    debug(
        "newTag: " + newArray.map((byte: any) => byte.toString(10)).join(" ")
    );

    return newArray;
}

/**
 * Insert a new tag into DICOM file
 * @description Insert a new tag into an existing DICOM file at a specific position
 * @precondition The dicomData must be a valid DICOM object, tagToAdd must be a valid tag object, newTag must be a valid byte array
 * @postcondition The dicomData object will be updated with the new tag
 * @param {Object} dicomData - Raw DICOM dataset with parsed elements
 * @param {Object} tagToAdd - Parsed tag data to add to the DICOM file
 * @param {string} tagToAdd.tagId - The ID of the tag to add (in format 'xGGGGEEEE')
 * @param {number} tagToAdd.dataOffSet - The data offset position for insertion
 * @param {Uint8Array} newtag - Byte array representation of the tag to insert
 * @returns {Uint8Array} Updated byte array with the tag inserted
 */
function insertTag(dicomData: any, tagToAdd: InsertTag, newtag: any) {
    const dicomByteArray = dicomData.byteArray;

    const first = dicomByteArray.slice(0, tagToAdd.dataOffSet - 8);
    const last = dicomByteArray.slice(
        tagToAdd.dataOffSet +
            dicomData.elements[tagToAdd.tagId.toLowerCase()].length
    );

    const buf1 = concatBuffers(first, newtag);
    const newArray = concatBuffers(buf1, last);

    debug("Insert at " + tagToAdd.dataOffSet);

    return newArray;
}

/**
 * Remove a tag from a file
 * @description Remove a tag from a DICOM file
 * @precondition The dicomData must be a valid dicom object, tagToRemove must be a valid tag object
 * @postcondition The dicomData object will be updated with the tag removed
 * @param {Object} dicomData - Raw DICOM dataset with parsed elements
 * @param {Object} tagToRemove - Tag to be removed from the dataset
 * @param {string} tagToRemove.tagId - The ID of the tag to remove (in format 'xGGGGEEEE')
 * @param {number} tagToRemove.dataOffSet - The data offset position of the tag
 * @returns {Uint8Array} Byte array with the tag removed
 */
function removeTag(dicomData: any, tagToRemove: InsertTag) {
    const dicomByteArray = dicomData.byteArray;

    const first = dicomByteArray.slice(0, tagToRemove.dataOffSet - 8);
    const last = dicomByteArray.slice(
        tagToRemove.dataOffSet +
            dicomData.elements[tagToRemove.tagId.toLowerCase()].length
    );

    const newArray = concatBuffers(first, last);

    debug("Remove at " + tagToRemove.dataOffSet);

    return newArray;
}

/**
 * Concatenate two byte arrays
 * @description Concatenate two byte arrays into a single new array
 * @precondition The buffer1 and buffer2 must be valid Uint8Array objects
 * @postcondition A new Uint8Array containing the concatenated content will be created
 * @param {Uint8Array} buffer1 - First byte array
 * @param {Uint8Array} buffer2 - Second byte array
 * @returns {Uint8Array} New concatenated byte array containing the content of both input arrays
 */
function concatBuffers(bufffer1: Uint8Array, buffer2: Uint8Array): Uint8Array {
    const concatedBuffer = new Uint8Array(bufffer1.length + buffer2.length);
    concatedBuffer.set(bufffer1);
    concatedBuffer.set(buffer2, bufffer1.length);
    return concatedBuffer;
}

/**
 * Create a tag byte array
 * @description Create a byte array representing a DICOM tag
 * @precondition The tagId must be a valid Uint8Array containing group and element identifiers, tag must be a valid object with VR and value
 * @postcondition A new Uint8Array will be created containing the complete tag representation
 * @param {Uint8Array} tagId - Tag's group and element identifiers in byte array format
 * @param {Object} tag - DICOM tag entry to be written to byte array
 * @param {string} tag.vr - Value Representation (VR) code
 * @param {string} tag.value - Tag value as string
 * @param {boolean} littleEndian - Whether to use little endian byte ordering
 * @returns {Uint8Array} The complete tag byte array representation
 */
function createTag(tagId: Uint8Array, tag: InsertTag, littleEndian: boolean) {
    const valueOffset =
        tag.vr in VR_with_12_bytes_header ? longHeaderLen : headerLen;
    const valueLength = getValueLength(tag);

    const tagVR = writeVRArray(tag.vr);
    const tagLength =
        valueOffset === longHeaderLen
            ? writeTypedNumber(
                  valueLength,
                  "uint32",
                  longHeaderLengthLen,
                  littleEndian
              )
            : writeTypedNumber(valueLength, "uint16", lengthLen, littleEndian);

    const newTag = new Uint8Array(valueLength + valueOffset);
    newTag.set(tagId);
    newTag.set(tagVR, vrOffset);
    newTag.set(tagLength, lengthOffset);

    debug("Tag VR: " + tag.vr);

    switch (tag.vr) {
        case "FD":
            newTag.set(
                writeTypedNumber(
                    parseInt(tag.newValue, 10),
                    "double",
                    valueLength,
                    littleEndian
                ),
                valueOffset
            );
            break;
        case "FL":
            newTag.set(
                writeTypedNumber(
                    parseInt(tag.newValue, 10),
                    "float",
                    valueLength,
                    littleEndian
                ),
                valueOffset
            );
            break;
        case "UL":
            newTag.set(
                writeTypedNumber(
                    parseInt(tag.newValue, 10),
                    "uint32",
                    valueLength,
                    littleEndian
                ),
                valueOffset
            );
            break;
        case "US":
            newTag.set(
                writeTypedNumber(
                    parseInt(tag.newValue, 10),
                    "uint16",
                    valueLength,
                    littleEndian
                ),
                valueOffset
            );
            break;
        case "SL":
            newTag.set(
                writeTypedNumber(
                    parseInt(tag.newValue, 10),
                    "int32",
                    valueLength,
                    littleEndian
                ),
                valueOffset
            );
            break;
        case "SS":
            newTag.set(
                writeTypedNumber(
                    parseInt(tag.newValue, 10),
                    "int16",
                    valueLength,
                    littleEndian
                ),
                valueOffset
            );
            break;
        // case 'AT':
        //     const atGroup = parseInt(tag.newValue.slice(0, 4), 16);
        //     const atElement = parseInt(tag.newValue.slice(4,), 16);
        //     newTag.set(writeTypedNumber(atGroup, 'uint16', valueLength / 2, littleEndian), valueOffset);
        //     newTag.set(writeTypedNumber(atElement, 'uint16', valueLength / 2, littleEndian), valueOffset + 2);
        //     break;
        default:
            for (let i = 0; i < tag.newValue.length; i++) {
                newTag[i + 8] = tag.newValue.charCodeAt(i);
            }
            break;
    }
    return newTag;
}

/**
 * Write a number to a byte array
 * @description Converts a number to a byte array representation based on the specified type
 * @precondition The num parameter must be a valid number, type must be one of the supported numeric types
 * @postcondition A new Uint8Array will be created containing the binary representation of the number
 * @param {number} num - Number to be converted to byte array
 * @param {string} type - Type of number conversion ('uint16', 'uint32', 'int8', 'int16', 'int32', 'float', 'double')
 * @param {number} arrayLength - Length of the resulting array in bytes
 * @param {boolean} littleEndian - Whether to use little endian byte ordering
 * @returns {Uint8Array} Byte array containing the binary representation of the number
 */
function writeTypedNumber(
    num: number,
    type: string,
    arrayLength: number,
    littleEndian: boolean
) {
    const arrbuff = new ArrayBuffer(arrayLength);
    const view = new DataView(arrbuff);
    switch (type) {
        case "uint16":
            view.setUint16(0, num, littleEndian);
            break;
        case "uint32":
            view.setUint32(0, num, littleEndian);
            break;
        case "int8":
            view.setInt8(0, num);
            break;
        case "int16":
            view.setInt16(0, num, littleEndian);
            break;
        case "int32":
            view.setInt32(0, num, littleEndian);
            break;
        case "float":
            view.setFloat32(0, num, littleEndian);
            break;
        case "double":
            view.setFloat64(0, num, littleEndian);
            break;
        default:
            break;
    }
    return new Uint8Array(arrbuff);
}

/**
 * Write a VR to a byte array
 * @description Converts a DICOM Value Representation (VR) string to its ASCII byte representation
 * @precondition The vr must be a valid 2-character string representing a DICOM VR code
 * @postcondition A new Uint8Array will be created containing the ASCII representation of the VR
 * @param {string} vr - The 2-character VR code to convert (e.g., "ST", "PN", "LO")
 * @returns {Uint8Array} Byte array containing the ASCII representation of the VR code
 */
function writeVRArray(vr: string) {
    const vrArray = new Uint8Array(vrLen);
    for (let i = 0; i < 2; i++) {
        vrArray[i] = vr.charCodeAt(i);
    }

    debug("VR: " + vrArray);
    return vrArray;
}

/**
 * Get the length of a tag's value
 * @description Calculates the appropriate byte length for a DICOM tag value based on its VR type
 * @precondition The tag must be a valid tag object with tagVR and value properties
 * @postcondition The length of the tag's value will be calculated according to DICOM standards
 * @param {Object} tag - DICOM tag object to calculate length for
 * @param {string} tag.tagVR - Value Representation (VR) code of the tag
 * @param {string|number} tag.tagValue - The value of the tag (for numeric types)
 * @param {string} tag.value - The string value of the tag (for string types)
 * @returns {number} Byte length required to store the tag value according to its VR
 */
function getValueLength(tag: InsertTag) {
    if (tag.vr in NUMBERS) {
        let value = parseInt(tag.newValue, 10);
        let byteLength = 1;
        /* tslint:disable */
        while ((value >>= 8) > 0) {
            /* tslint:enable */
            byteLength++;
        }
        switch (tag.vr[1]) {
            case "S":
                byteLength += 2 - (byteLength % 2);
                break;
            case "L":
                byteLength += 4 - (byteLength % 4);
                break;
            case "D":
                byteLength += 8 - (byteLength % 8);
                break;
            default:
                break;
        }
        return byteLength;
    } else if (tag.vr === "AT") {
        return 4;
    } else {
        debug("Tag value length: " + tag.newValue.length);

        return tag.newValue.length;
    }
}

/**
 * Get the tags for a single file, filtered by the file name
 * @description Filters tag objects to return only those associated with a specific file
 * @precondition The newTags must be a valid array of tag objects, fileName must be a valid string
 * @postcondition An array containing only tags for the specified file will be returned
 * @param {Array<Object>} newTags - Array of tag objects to filter
 * @param {string} newTags[].fileName - The file name associated with each tag
 * @param {string} newTags[].tagId - The ID of the tag
 * @param {string} newTags[].newValue - The new value for the tag
 * @param {string} fileName - The file name to filter tags by
 * @returns {Array<Object>} Array of tag objects that match the specified fileName
 */
export function getSingleFileTagEdits(newTags: TableUpdateData[], fileName: string): TableUpdateData[] {
    return newTags.filter((tag: any) => tag.fileName === fileName);
}

/**
 * Verify that the data is a valid DICOM array buffer
 * @description Attempts to parse the data as a DICOM file to validate its structure
 * @precondition The data must be a Uint8Array containing potential DICOM data
 * @postcondition The data will be verified as a valid DICOM array buffer
 * @param {Uint8Array} data - The byte array to be verified
 * @returns {boolean} True if the data is a valid DICOM array buffer, false otherwise
 */
function verifyArrayBuffer(data: any) {
    try {
        dicomParser.parseDicom(data);
        logger.info("Valid array buffer");
        debug("Valid array buffer");
        return true;
    } catch (e) {
        logger.error("Error parsing new array: " + e);
        debug("Error parsing new array: " + e);
        return false;
    }
}
