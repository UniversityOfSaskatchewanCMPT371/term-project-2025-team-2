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

import dicomParser from "dicom-parser";
import logger from "@logger/Logger";
import { TableUpdateData, InsertTag } from "@dicom//Types/DicomTypes";

//mset to turn on console logs for debugging
const DEBUG = false;

const debug = (message: string) => {
    if (DEBUG) {
        console.log(message);
    }
};

enum NUMBERS {
    "FD",
    "FL",
    "UL",
    "US",
    "SL",
    "SS",
}
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
const groupLen = 2;
const elementLen = 2;
const vrLen = 2;
const lengthLen = 2;
const longHeaderLengthLen = 4;
const headerLen = 8;
const longHeaderLen = 12;
const vrOffset = 4;
const lengthOffset = 6;

/**
 * Update the tags in a dicom file
 * @description - Update the tags in a dicom file
 * @precondition - The dicomData must be a valid dicom object, newTagData must be a valid array of tag objects
 * @postcondition - The dicomData object will be updated with the new tag values
 * @param dicomData - The dicom data object
 * @param newTagData - The new tag values
 * @returns newDicomData - The updated dicom data object, byte array
 */
export function tagUpdater(dicomData: dicomParser.DataSet, newTagData: any) {
    const newTags: InsertTag[] = [];
    const newDicomData = dicomData.byteArray;
    const filteredTags = newTagData;
    let data: any;

    const implicitTags =
        dicomData.string("x00020010") === "1.2.840.10008.1.2" ? true : false;

    debug("Implicit: " + implicitTags);

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
            data = addTag(dicomData, tag, implicitTags);
        } else {

            const tagIdByte = new Uint8Array(groupLen + elementLen);
            const group = parseInt(tag.tagId.slice(1, 5), 16);
            const element = parseInt(tag.tagId.slice(5), 16);
            debug("Group: " + group + " Element: " + element);

            tag.dataOffSet =
                dicomData.elements[tag.tagId.toLowerCase()].dataOffset;

            tagIdByte.set(
                new Uint8Array([group, group >> 8, element, element >> 8])
            );
            const newTag = createTag(tagIdByte, tag, true, implicitTags);
            data = insertTag(dicomData, tag, newTag);

            debug("newTag: " + newTag);
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
 *
 * @param dicomData
 * @param tag
 * @returns
 */
function addTag(dicomData: any, tag: InsertTag, implicit: boolean): Uint8Array {
    const tagIdByte = new Uint8Array(groupLen + elementLen);
    const group = parseInt(tag.tagId.slice(1, 5), 16);
    const element = parseInt(tag.tagId.slice(5), 16);

    tagIdByte.set(new Uint8Array([group, group >> 8, element, element >> 8]));
    const newTag = createTag(tagIdByte, tag, true, implicit);

    const newArray = concatBuffers(dicomData.byteArray, newTag);

    debug(
        "newTag: " + newArray.map((byte: any) => byte.toString(10)).join(" ")
    );

    return newArray;
}

/**
 * Insert a new tag into dicom file
 * @description insert a new tag into dicom file
 * @precondition - The dicomData must be a valid dicom object, tagToAdd must be a valid tag object, newTag must be a valid byte array
 * @postcondition - The dicomData object will be updated with the new tag
 * @param dicomData - raw dicom data set
 * @param tagToAdd - parsed tag data to add to dicom
 * @param newTag - bytearray to insert into dicom file
 * @returns byte array with tag inserted
 */
function insertTag(dicomData: any, tagToAdd: InsertTag, newtag: Uint8Array): Uint8Array {
    const dicomByteArray = dicomData.byteArray;

    const first = dicomByteArray.slice(0, tagToAdd.dataOffSet - 8);
    const last = dicomByteArray.slice(
        tagToAdd.dataOffSet +
            dicomData.elements[tagToAdd.tagId.toLowerCase()].length
    );

    const buf1 = concatBuffers(first, newtag);
    const newArray = concatBuffers(buf1, last);

    debug("Insert at " + tagToAdd.dataOffSet);
    debug(
        dicomByteArray.slice(
            tagToAdd.dataOffSet - 8,
            tagToAdd.dataOffSet +
                dicomData.elements[tagToAdd.tagId.toLowerCase()].length
        )
    );

    return newArray;
}

/**
 * Remove a tag from a file
 * @description remove a tag from a file
 * @precondition - The dicomData must be a valid dicom object, tagToRemove must be a valid tag object
 * @postcondition - The dicomData object will be updated with the tag removed
 * @param dicomData - raw dicom data set
 * @param tagToRemove - tag to be removed
 * @returns byte array with tag removed
 */
function removeTag(dicomData: any, tagToRemove: InsertTag): Uint8Array {
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
 * @description concatenate two byte arrays
 * @precondition - The buffer1 and buffer2 must be valid byte arrays
 * @postcondition - The two byte arrays will be concatenated
 * @param bufffer1 - first byte array
 * @param buffer2 - second byte array
 * @returns concatenated byte array
 */
function concatBuffers(bufffer1: Uint8Array, buffer2: Uint8Array): Uint8Array {
    const concatedBuffer = new Uint8Array(bufffer1.length + buffer2.length);
    concatedBuffer.set(bufffer1);
    concatedBuffer.set(buffer2, bufffer1.length);
    return concatedBuffer;
}

/**
 * Create a tag byte array
 * @description create a tag byte array
 * @precondition - The tagName and tag must be valid byte arrays
 * @postcondition - The tag byte array will be created
 * @param tagName tag's group and element in bytearray
 * @param tag dicom entry to be written to bytearray
 * @description creates a bytearray representing the tag
 * @return tag's bytearray
 */
function createTag(tagName: Uint8Array, tag: InsertTag, littleEndian: boolean, implicit: boolean): Uint8Array {
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
    newTag.set(tagName);
    if (implicit) {
        // handle Implicit VR Little Endian (UID: 1.2.840.10008.1.2)
        // newTag.set(tagVR, lengthOffset); VR not needed, length gets put a vr offset
        newTag.set(tagLength, vrOffset);
    } else {
        newTag.set(tagVR, vrOffset);
        newTag.set(tagLength, lengthOffset);
    }

    debug("new: " + newTag);

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
 * @param num - number to be converted to bytearray
 * @param type - type of number to be converted
 * @param arrayLength - length of the array
 * @param littleEndian - whether the number is little endian
 * @description converts a number to a bytearray
 * @return number's bytearray
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
 * @precondition - The vr must be a valid 2 character string
 * @postcondition - The vr will be written to a byte array, ascii
 * @param vr - the 2 character vr
 * @returns byte array of vr value
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
 * @precondition - The tag must be a valid tag object
 * @postcondition - The length of the tag's value will be calculated
 * @param tag - tag to be written to bytearray
 * @description gets the length of the tag's value
 * @return length of the tag's value
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
 * @description - Get the tags for a single file, filtered by the file name
 * @precondition - The newTags must be a valid array of tag objects, fileName must be a valid string
 * @postcondition - The tags edited for a single file will be returned
 * @param newTags
 * @param fileName
 * @returns - object tags edited for a single file
 */
export function getSingleFileTagEdits(newTags: TableUpdateData[], fileName: string): TableUpdateData[] {
    return newTags.filter((tag: TableUpdateData) => tag.fileName === fileName);
}

/**
 * Verify that the data is an array buffer
 * @description - Verify that the data is an array buffer
 * @precondition - The data must be a valid array buffer
 * @postcondition - The data will be verified as an array buffer
 * @param data - The data to be verified
 * @returns - True if the data is an array buffer, false otherwise
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
