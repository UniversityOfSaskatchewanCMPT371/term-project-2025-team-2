import { createFile, downloadDicomFile } from "./DownloadFuncs";
import { createZipFromFiles } from "./DownloadFuncs";
import { tagUpdater } from "./TagUpdater";
import { getSingleFileTagEdits } from "./TagUpdater";
import logger from "@logger/Logger";

/**
 * Update all files with new tag values
 * @description - Update all files with new tag values
 * @precondition - The dicom data must be an array of objects,
 * series must be a boolean,
 * newTagValues must be an object,
 * files must be an array of objects,
 * currentFileIndex must be a number,
 * downloadOption must be a string
 * @postcondition - The files are updated with the new tag values and downloaded
 * @param dicomData - The dicom data object
 * @param series - boolean if the dicom data is a series
 * @param newTagValues - The new tag values
 * @param files - The files to update
 * @param currentFileIndex - The index of the current file
 * @param downloadOption - The download option
 */
export const updateAllFiles = async (
    dicomData: any[],
    series: boolean,
    newTagValues: any,
    files: { name: string }[],
    currentFileIndex: number,
    downloadOption: string
) => {
    const newFiles: any = [];

    if (series) {
        logger.info("Updating all files in series");

        dicomData.forEach((dicom: any, index: number) => {
            const fileName = files[index].name;
            const fileEdits = getSingleFileTagEdits(
                newTagValues,
                files[currentFileIndex].name
            );
            const isEdited = fileEdits && Object.keys(fileEdits).length > 0;

            const updatedFile = tagUpdater(dicom.DicomDataSet, fileEdits);
            const file = createFile(fileName, updatedFile, isEdited);

            if (downloadOption === "single") {
                downloadDicomFile(file);
            } else {
                newFiles.push(file);
            }
        });
    } else {
        logger.info("Updating single file");

        dicomData.forEach((dicom, index) => {
            const fileName = files[index].name;
            const fileEdits = getSingleFileTagEdits(newTagValues, fileName);
            const isEdited = fileEdits && Object.keys(fileEdits).length > 0;

            const updatedFile = tagUpdater(dicom.DicomDataSet, fileEdits);
            const file = createFile(fileName, updatedFile, isEdited);

            if (downloadOption === "single") {
                downloadDicomFile(file);
            } else {
                newFiles.push(file);
            }
        });
    }

    if (downloadOption === "zip") {
        logger.info("Creating ZIP file");

        const zipFile = await createZipFromFiles(newFiles);
        downloadDicomFile({ name: "updateDicoms.zip", content: zipFile });
    }
};
