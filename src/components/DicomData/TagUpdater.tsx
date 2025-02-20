/**
 *
 * @param dicomData - The dicom data object
 * @param newTableData - The new tag values
 * @returns newDicomData - The updated dicom data object, byte array
 */
export function tagUpdater(dicomData: any, newTableData: any) {
    const newTags: any = [];
    const newDicomData = dicomData.byteArray;
    const filteredTags = newTableData;
    let data;

    if (filteredTags.length === 0) {
        return newDicomData;
    }

    filteredTags.forEach((tag: any) => {
        const insertTag = {
            tagId: tag.tagId,
            value: tag.newValue,
            vr: dicomData.elements[tag.tagId.toLowerCase()].vr || "UN",
            dataOffSet:
                dicomData.elements[tag.tagId.toLowerCase()].dataOffset || 0,
            length: tag.newValue.length,
        };
        newTags.push(insertTag);
    });

    newTags.forEach((tag: any) => {
        const tagIdByte = new Uint8Array(groupLen + elementLen);
        const group = parseInt(tag.tagId.slice(1, 5), 16);
        const element = parseInt(tag.tagId.slice(5), 16);

        tagIdByte.set(
            new Uint8Array([group, group >> 8, element, element >> 8])
        );

        const newTag = createTag(tagIdByte, tag, true);

        data = insertTag(dicomData, tag, newTag);
    });

    return data;
}

/**
 * @description insert a new tag into dicom file
 * @param dicomData - raw dicom data set
 * @param tagToAdd - parsed tag data to add to dicom
 * @param newTag - bytearray to insert into dicom file
 * @returns byte array with tag inserted
 */
function insertTag(dicomData: any, tagToAdd: any, newtag: any) {
    const dicomByteArray = dicomData.byteArray;

    const first = dicomByteArray.slice(0, tagToAdd.dataOffSet - 8);
    const last = dicomByteArray.slice(
        tagToAdd.dataOffSet +
            dicomData.elements[tagToAdd.tagId.toLowerCase()].length
    );

    const buf1 = concatBuffers(first, newtag);
    const newArray = concatBuffers(buf1, last);

    return newArray;
}

/**
 * @description remove a tag from a file
 * @param dicomData - raw dicom data set
 * @param tagToRemove - tag to be removed
 * @returns byte array with tag removed
 */
export function removeTag(dicomData: any, tagToRemove: any) {
    const dicomByteArray = dicomData.byteArray;

    const first = dicomByteArray.slice(0, tagToRemove.dataOffSet - 8);
    const last = dicomByteArray.slice(
        tagToRemove.dataOffSet +
            dicomData.elements[tagToRemove.tagId.toLowerCase()].length
    );

    const newArray = concatBuffers(first, last);

    return newArray;
}

/**
 *
 * @param bufffer1
 * @param buffer2
 * @returns
 */
function concatBuffers(bufffer1: Uint8Array, buffer2: Uint8Array): Uint8Array {
    const concatedBuffer = new Uint8Array(bufffer1.length + buffer2.length);
    concatedBuffer.set(bufffer1);
    concatedBuffer.set(buffer2, bufffer1.length);
    return concatedBuffer;
}

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
 * @param tagName tag's group and element in bytearray
 * @param tag dicom entry to be written to bytearray
 * @description creates a bytearray representing the tag
 * @return tag's bytearray
 */
function createTag(tagName: Uint8Array, tag: any, littleEndian: boolean) {
    const valueOffset =
        tag.tagVR in VR_with_12_bytes_header ? longHeaderLen : headerLen;
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
    newTag.set(tagVR, vrOffset);
    newTag.set(tagLength, lengthOffset);

    switch (tag.tagVR) {
        case "FD":
            newTag.set(
                writeTypedNumber(
                    parseInt(tag.tagValue, 10),
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
                    parseInt(tag.tagValue, 10),
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
                    parseInt(tag.tagValue, 10),
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
                    parseInt(tag.tagValue, 10),
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
                    parseInt(tag.tagValue, 10),
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
                    parseInt(tag.tagValue, 10),
                    "int16",
                    valueLength,
                    littleEndian
                ),
                valueOffset
            );
            break;
        // case 'AT':
        //     const atGroup = parseInt(tag.value.slice(0, 4), 16);
        //     const atElement = parseInt(tag.value.slice(4,), 16);
        //     newTag.set(writeTypedNumber(atGroup, 'uint16', valueLength / 2, littleEndian), valueOffset);
        //     newTag.set(writeTypedNumber(atElement, 'uint16', valueLength / 2, littleEndian), valueOffset + 2);
        //     break;
        default:
            for (let i = 0; i < tag.value.length; i++) {
                newTag[i + 8] = tag.value.charCodeAt(i);
            }
            break;
    }
    return newTag;
}

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
            view.setUint16(0, num, littleEndian);
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
 *
 * @param vr - the 2 character vr
 * @returns byte array of vr value
 */
function writeVRArray(vr: string) {
    const vrArray = new Uint8Array(vrLen);
    for (let i = 0; i < 2; i++) {
        vrArray[i] = vr.charCodeAt(i);
    }
    return vrArray;
}

function getValueLength(tag: any) {
    if (tag.tagVR in NUMBERS) {
        let value = parseInt(tag.tagValue, 10);
        let byteLength = 1;
        /* tslint:disable */
        while ((value >>= 8) > 0) {
            /* tslint:enable */
            byteLength++;
        }
        switch (tag.tagVR[1]) {
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
    } else if (tag.tagVR === "AT") {
        return 4;
    } else {
        return tag.value.length;
    }
}

/**
 * @description - Get the tags for a single file, filtered by the file name
 * @param newTags
 * @param fileName
 * @returns - object tags edited for a single file
 */
export function getSingleFileTagEdits(newTags: any, fileName: string) {
    return newTags.filter((tag: any) => tag.fileName === fileName);
}

/**
 * @description - Download the dicom file, single file
 * @param blobData - The dicom data object, byteArray
 * @param fileName - string name of the file
 */
export function downloadDicomFile(blobData: any, fileName: string) {
    const blob = new Blob([blobData], {
        type: "application/dicom",
    });

    const newFileName = fileName.includes(".dcm")
        ? fileName.slice(0, -4)
        : fileName;

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = newFileName + "_edited.dcm";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
}
