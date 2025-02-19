
/**
 * 
 * @param dicomData - The dicom data object
 * @param newTableData - The new tag values
 * @returns newDicomData - The updated dicom data object, byte array
 */
export function tagUpdater(dicomData: any, newTableData: any) {
    
    const newTags: any = [];
    let newDicomData = dicomData.byteArray;

    newTableData.forEach((tag: any) => {
        const insertTag = {
            tagId: tag.tagId,
            value: tag.newValue,
            vr: dicomData.elements[tag.tagId.toLowerCase()].vr || "UN",
            dataOffSet: dicomData.elements[tag.tagId.toLowerCase()].dataOffset || 0,
            length: tag.newValue.length,
        };
        newTags.push(insertTag);
    });

    newTags.forEach((tag: any) => {
        for (let i = tag.dataOffSet; i < tag.dataOffSet + dicomData.elements[tag.tagId.toLowerCase()].length; i++) {
            if (i < tag.value.length + tag.dataOffSet) {
                newDicomData[i] = tag.value.charCodeAt(i - tag.dataOffSet);
            } else {
                newDicomData[i] = " ".charCodeAt(0);
            }
        }
    });

    return newDicomData;

}
