/**
 * createRows function
 * @description Function to create rows for the DICOM table
 * @precondition - createRows function expects the following parameters
 * @precondition - dicomData - DICOM data object
 * @param dicomData
 * @param fileName
 * @param newTableData
 * @returns {Array<TableRow>}
 */
export const createRows = (
    dicomData: any,
    fileName: string,
    newTableData: any[]
) => {
    return Object.entries(dicomData.tags).map(
        ([tagId, tagData]: [string, any]) => ({
            tagId,
            tagName: tagData.tagName,
            value:
                newTableData.find(
                    (row: any) =>
                        row.fileName === fileName && row.tagId === tagId
                )?.newValue || tagData.value,
            hidden: tagData.hidden || false,
            updated: newTableData.find(
                (row: any) => row.fileName === fileName && row.tagId === tagId
            )?.newValue
                ? true
                : false,
        })
    );
};
