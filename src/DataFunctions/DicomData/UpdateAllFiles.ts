import { createFile, downloadDicomFile } from "./DownloadFuncs";
import { createZipFromFiles } from "./DownloadFuncs";
import { tagUpdater } from "./TagUpdater";
import { getSingleFileTagEdits } from "./TagUpdater";
import logger from "@logger/Logger";
import { DicomData, TableUpdateData } from "@dicom//Types/DicomTypes";
import { useStore } from "@state/Store";

/**
 * Update all files with new tag values
 * @description - Update all files with new tag values and maintain folder structure
 * @precondition - The dicom data must be an array of objects,
 * series must be a boolean,
 * newTagValues must be an object,
 * files must be an array of objects,
 * currentFileIndex must be a number,
 * downloadOption must be a string,
 * fileStructure must be a record of folder paths to files
 * @postcondition - The files are updated with the new tag values and downloaded
 * @param dicomData - The dicom data object
 * @param series - boolean if the dicom data is a series
 * @param newTagValues - The new tag values
 * @param files - The files to update
 * @param currentFileIndex - The index of the current file
 * @param downloadOption - The download option
 * @param fileStructure - The file structure containing folder paths
 */
export const updateAllFiles = async (
    dicomData: DicomData[],
    series: boolean,
    newTagValues: TableUpdateData[],
    files: { name: string }[],
    currentFileIndex: number,
    downloadOption: string,
    fileStructure: Record<string, File[]>,
    setLoadingMsg: (msg: string) => void
) => {
    const newFiles: any = [];

    if (series) {
        logger.info("Updating all files in series");

        dicomData.forEach((dicom: DicomData, index: number) => {
            setLoadingMsg(`Updating file ${index + 1} of ${dicomData.length}`);

            const fileName = files[index].name;
            const fileEdits = getSingleFileTagEdits(
                newTagValues,
                files[currentFileIndex].name
            );
            const isEdited = fileEdits && Object.keys(fileEdits).length > 0;

            const updatedFile = tagUpdater(dicom.DicomDataSet, fileEdits);

            // Create file object
            const file = createFile(fileName, updatedFile, isEdited);

            // Set the correct file path information
            const filePath = determineFilePath(fileName, fileStructure);
            file.path = filePath;

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

            // Create file object
            const file = createFile(fileName, updatedFile, isEdited);

            // Set the correct file path information
            const filePath = determineFilePath(fileName, fileStructure);
            file.path = filePath;

            if (downloadOption === "single") {
                downloadDicomFile(file);
            } else {
                newFiles.push(file);
            }
        });
    }

    if (downloadOption === "zip") {
        logger.info("Creating ZIP file with folder structure");
        useStore.getState().setLoadingMsg("Creating ZIP file");
        const zipFile = await createZipFromFiles(newFiles);
        downloadDicomFile({ name: "updateDicoms.zip", content: zipFile });
    }
};

/**
 * Determine the file path for a dicom file
 * @description - Determine the correct file path for a dicom file based on dicom data or folder structure
 * @param dicom - The dicom data object
 * @param fileName - The name of the file
 * @param fileStructure - The file structure object mapping folders to files
 * @returns The path for the file
 */
function determineFilePath(
    // dicom: DicomData,
    fileName: string,
    fileStructure: Record<string, File[]>
): string {
    // // First check if dicom has path information
    // if (dicom.filePath) {
    //     // Extract just the directory path, not including the filename
    //     const pathParts = dicom.filePath.split('/');
    //     pathParts.pop(); // Remove filename
    //     return pathParts.join('/');
    // }

    // If no path in dicom data, look it up in the folder structure
    for (const [folder, folderFiles] of Object.entries(fileStructure)) {
        // Check if this folder contains the file
        const matchingFile = folderFiles.find((f) => f.name === fileName);
        if (matchingFile) {
            return folder === "root" ? "" : folder;
        }
    }

    // Default to root if no folder info found
    return "";
}
