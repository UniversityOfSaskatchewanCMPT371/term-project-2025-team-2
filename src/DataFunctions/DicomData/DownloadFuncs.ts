import JSZip from "jszip";
import { FileData } from "@features/FileHandling/Types/FileTypes";
import { assert } from "../assert";
import logger from "../../Logger/Logger";

/**
 * Creates a ZIP file containing multiple files
 * @description - Create a zip file from multiple files
 * @precondition - The files array must contain objects with a name and content
 * @postcondition - The ZIP file is created and returned as a Blob
 * @param files - Array of files with name and content
 * @returns Promise resolving to the ZIP file as a Blob
 */
export async function createZipFromFiles(files: FileData[]): Promise<Blob> {
    logger.info("Creating ZIP file from files");
    logger.debug(`Number of files: ${files.length}`);

    try {
        const zip = new JSZip();

        // Add each file to the ZIP
        files.forEach((file) => {
            zip.file(file.name, file.content);
        });

        // Generate the ZIP file
        const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 6, // Compression level (1-9)
            },
        });

        logger.debug(`ZIP file created: ${zipBlob.size} bytes`);

        assert(zipBlob !== null);

        return zipBlob;
    } catch (error) {
        logger.error(`Failed to create ZIP: ${error}`);
        throw new Error(`Failed to create ZIP: ${error}`);
    }
}

/**
 * Downloads a file as a Blob
 * @description - Download the dicom file, single file
 * @precondition - The file object must have a name and content
 * @postcondition - The file is downloaded to the user's device
 * @param blobData - The dicom data object, byteArray
 * @param fileName - string name of the file
 */
export async function downloadDicomFile(newFile: FileData) {
    // assert(newFile.content !== null);
    // assert(newFile.name !== null);

    logger.info("Downloading DICOM file: ", newFile.name);

    const url = window.URL.createObjectURL(newFile.content);

    const link = document.createElement("a");
    link.href = url;
    link.download = newFile.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

/**
 * Create a new file object
 * @description - Create a new file object
 * @precondition - The blobData must be a valid Blob, fileName must be a string, isEdited must be a boolean
 * @postcondition - The file object is created and returned
 * @param fileName - string name of the file
 * @param blobData - The dicom data object, byteArray
 * @param isEdited - boolean flag indicating if the file has been edited
 * @returns - object with name and content of the file
 */
export function createFile(fileName: string, blobData: any, isEdited: boolean) {
    logger.debug("Creating file object: ", fileName);

    const blob = new Blob([blobData], {
        type: "application/dicom",
    });

    const baseName = fileName.endsWith(".dcm")
        ? fileName.slice(0, -4)
        : fileName;

    const finalName = isEdited ? `${baseName}_edited.dcm` : `${baseName}.dcm`;

    logger.debug("File created: ", finalName);

    return { name: finalName, content: blob };
}
