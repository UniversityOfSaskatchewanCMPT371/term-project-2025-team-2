import { createFile, downloadDicomFile } from "./DownloadFuncs";
import { createZipFromFiles } from "./DownloadFuncs";
import { tagUpdater } from "./TagUpdater";
import { getSingleFileTagEdits } from "./TagUpdater";
import logger from "@logger/Logger";
import { DicomData, TableUpdateData } from "@dicom//Types/DicomTypes";
import { useStore } from "@state/Store";

/**
 * Update all files with new tag values
 * @description Updates DICOM files with new tag values and maintains original folder structure for download
 *
 * @precondition
 * - dicomData must be a non-empty array of valid DicomData objects with DicomDataSet property
 * - series must be a boolean indicating whether all files belong to the same series
 * - newTagValues must be a valid array of TableUpdateData objects containing tag update information
 * - files must be an array of objects with name property matching the DICOM files
 * - currentFileIndex must be a valid index within the files array
 * - downloadOption must be either "single" or "zip"
 * - fileStructure must be a valid Record mapping folder paths to arrays of File objects
 * - setLoadingMsg must be a function that accepts a string parameter
 *
 * @postcondition
 * - The DICOM files are updated with the specified tag values
 * - If downloadOption is "single", each file is downloaded individually
 * - If downloadOption is "zip", all files are downloaded as a single ZIP with preserved folder structure
 * - Loading messages are displayed during processing
 *
 * @param {DicomData[]} dicomData - Array of DICOM data objects to update
 * @param {boolean} series - Whether the files belong to the same series
 * @param {TableUpdateData[]} newTagValues - New tag values to apply to the files
 * @param {{ name: string }[]} files - Array of file objects with name property
 * @param {number} currentFileIndex - Index of the current file in the files array
 * @param {string} downloadOption - Download option ("single" or "zip")
 * @param {Record<string, File[]>} fileStructure - Map of folder paths to arrays of File objects
 * @param {(msg: string) => void} setLoadingMsg - Function to set loading message during processing
 *
 * @returns {Promise<void>} Promise that resolves when all files have been updated and download initiated
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
        useStore.getState().setLoadingMsg("Updating all files");
        useStore.getState().setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 0));

        for (let index = 0; index < dicomData.length; index++) {
            const dicom = dicomData[index];

            setLoadingMsg(`Updating file ${index + 1} of ${dicomData.length}`);
            await new Promise((resolve) => setTimeout(resolve, 0));

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
        };
    } else {
        logger.info("Updating single file");
        useStore.getState().setLoadingMsg("Updating all files");
        useStore.getState().setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 0));

        for (let index = 0; index < dicomData.length; index++) {
            const dicom = dicomData[index];

            setLoadingMsg(`Updating file ${index + 1} of ${dicomData.length}`);
            await new Promise((resolve) => setTimeout(resolve, 0));

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
        };
    }

    if (downloadOption === "zip") {
        logger.info("Creating ZIP file with folder structure");
        useStore.getState().setLoadingMsg("Creating ZIP file");
        const zipFile = await createZipFromFiles(newFiles);
        downloadDicomFile({ name: "updateDicoms.zip", content: zipFile });
    }
};

/**
 * Determine the file path for a DICOM file
 * @description Determines the correct file path for a DICOM file based on the folder structure
 * @precondition
 * - fileName must be a non-empty string representing a valid file name
 * - fileStructure must be a valid Record object mapping folder paths to arrays of File objects
 * - Each File object in fileStructure must have a name property
 * @postcondition
 * - If the file is found in the folder structure, returns the folder path (empty string for root)
 * - If the file is not found in any folder, returns an empty string (root folder)
 * @param {string} fileName - The name of the file to locate
 * @param {Record<string, File[]>} fileStructure - Map of folder paths to arrays of File objects
 * @returns {string} The path for the file (empty string for root folder)
 */
function determineFilePath(
    // dicom: DicomData,
    fileName: string,
    fileStructure: Record<string, File[]>
): string {
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
