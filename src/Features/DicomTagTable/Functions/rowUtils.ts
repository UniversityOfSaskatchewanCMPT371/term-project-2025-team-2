import logger from "@logger/Logger";

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
    logger.debug("Creating rows for the DICOM table");

    const data = Object.entries(dicomData.tags).map(
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

    newTableData.forEach((tag) => {
        if (tag.add && tag.fileName === fileName) {
            data.push({
                tagId: tag.tagId,
                tagName: "name",
                value: tag.newValue,
                hidden: false,
                updated: false,
            });
        }
    });

    logger.debug(`Created ${data.length} rows for the DICOM table`);

    return data;
};
