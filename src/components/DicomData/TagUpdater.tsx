import { AnyActionArg } from "react";

/**
 *
 * @param dicomData - The dicom data object
 * @param newTableData - The new tag values
 * @returns newDicomData - The updated dicom data object, byte array
 */
export function tagUpdater(
    dicomData: any,
    newTableData: any,
) {
    const newTags: any = [];
    const newDicomData = dicomData.byteArray;
    const filteredTags = newTableData

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
        for (
            let i = tag.dataOffSet;
            i <
            tag.dataOffSet + dicomData.elements[tag.tagId.toLowerCase()].length;
            i++
        ) {
            if (i < tag.value.length + tag.dataOffSet) {
                newDicomData[i] = tag.value.charCodeAt(i - tag.dataOffSet);
            } else {
                newDicomData[i] = " ".charCodeAt(0);
            }
        }
    });

    return newDicomData;
}

/**
 *
 * @param newTags
 * @param fileName
 * @returns
 */
export function getSingleFileTagEdits(newTags: any, fileName: string) {
    return newTags.filter((tag: any) => tag.fileName === fileName);
}

/**
 *
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
