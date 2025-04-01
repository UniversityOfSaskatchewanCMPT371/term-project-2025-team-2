import JSZip from "jszip";
import { FileData } from "@features/FileHandling/Types/FileTypes";
import { assert } from "../assert";
import logger from "@logger/Logger";
import { useStore } from "@state/Store";

/**
 * Creates a ZIP file containing multiple files, preserving folder structure
 * @description Creates a compressed ZIP archive from multiple files while maintaining their folder hierarchy
 * @precondition The files array must contain FileData objects with name, content, and optional path properties
 * @postcondition A ZIP file is created with preserved folder structure and returned as a Blob
 * @param {FileData[]} files - Array of file objects with name, content, and optional path properties
 * @param {string} files[].name - The name of each file
 * @param {Blob} files[].content - The content of each file as a Blob
 * @param {string} [files[].path] - Optional folder path for the file (empty string for root level)
 * @returns {Promise<Blob>} Promise resolving to the ZIP file as a Blob
 * @throws {Error} If ZIP creation fails for any reason
 */
export async function createZipFromFiles(files: FileData[]): Promise<Blob> {
    logger.info("Creating ZIP file from files");
    logger.debug(`Number of files: ${files.length}`);

    const { setLoadingMsg } = useStore.getState();

    try {
        const zip = new JSZip();

        // Create a map to group files by their folder path
        // Use a composite key of metadata for matching when available
        const folderMap = new Map<string, FileData[]>();

        // Create a lookup map for files with the same name but different metadata
        const fileSignatureMap = new Map<string, string>();

        // First pass - analyze files and create signatures
        files.forEach((file) => {
            const size = file.content?.size;
            const lastModified = file.metadata?.lastModified;

            // Create a unique signature for this file based on available metadata
            let fileSignature = file.name;
            if (size !== undefined) fileSignature += `-${size}`;
            if (lastModified) fileSignature += `-${lastModified}`;

            // Store the signature mapping
            logger.debug("File signature: ", fileSignature);
            fileSignatureMap.set(fileSignature, file.path || "");
        });

        // Second pass - organize files by folder using the signature lookups
        files.forEach((file) => {
            // Determine folder path based on metadata matching
            let folderPath = "";

            // Try to find the folder path using the file signature
            const size = file.content?.size;
            const lastModified = file.metadata?.lastModified;
            let fileSignature = file.name;
            if (size !== undefined) fileSignature += `-${size}`;
            if (lastModified) fileSignature += `-${lastModified}`;

            // If we have a mapping for this signature, use it
            if (fileSignatureMap.has(fileSignature)) {
                folderPath = fileSignatureMap.get(fileSignature) || "";
            }
            // Otherwise fall back to the original logic
            else if (file.path) {
                folderPath = file.path;
            } else if (file.name.includes("/")) {
                const parts = file.name.split("/");
                parts.pop();
                folderPath = parts.join("/");
            }

            // Add to the folder mapping
            if (!folderMap.has(folderPath)) {
                folderMap.set(folderPath, []);
            }
            folderMap.get(folderPath)?.push(file);

            logger.debug(
                `Adding file ${file.name} to folder ${folderPath || "root"}`
            );
        });

        folderMap.forEach((folderFiles, folderPath) => {
            folderFiles.forEach((file) => {
                setLoadingMsg(`Zipping file: ${file.name}`);
                let fileName = file.name;
                if (file.name.includes("/")) {
                    fileName = file.name.split("/").pop() || file.name;
                }

                let fullPath = fileName;
                if (folderPath) {
                    const normalizedPath = folderPath.endsWith("/")
                        ? folderPath
                        : `${folderPath}/`;
                    fullPath = normalizedPath + fileName;
                }

                logger.debug(`Adding to ZIP: ${fullPath}`);
                zip.file(fullPath, file.content);
            });
        });

        setLoadingMsg("Generating ZIP file");
        const zipBlob = await zip.generateAsync({
            type: "blob",
            // creates smaller file, but alot slower
            // compression: "DEFLATE",
            // compressionOptions: {
            //     level: 6,
            // },
        });

        logger.debug(`ZIP file created: ${zipBlob.size} bytes`);
        assert(zipBlob !== null);
        return zipBlob;
    } catch (error) {
        logger.error(`Failed to create ZIP: ${error}`);

        useStore.getState().setAlertType("alert-error");
        useStore
            .getState()
            .setAlertMsg("Error creating ZIP file. Please try again.");
        useStore.getState().setShowAlert(true);

        throw new Error(`Failed to create ZIP: ${error}`);
    }
}

/**
 * Downloads a file to the user's device
 * @description Triggers a browser download of a DICOM file or any other file format
 * @precondition The file object must have valid name and content properties
 * @postcondition The file is downloaded to the user's device through the browser's download mechanism
 * @param {FileData} newFile - The file object containing name and content
 * @param {string} newFile.name - The name of the file to be downloaded
 * @param {Blob} newFile.content - The content of the file as a Blob
 * @returns {Promise<void>} A promise that resolves when the download is initiated
 */
export async function downloadDicomFile(newFile: FileData) {
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
 * Create a new file object for DICOM data
 * @description Creates a FileData object from raw DICOM data with appropriate naming
 * @precondition The blobData must be a valid Uint8Array or Blob, fileName must be a string, isEdited must be a boolean
 * @postcondition A FileData object is created with appropriate name and content properties
 * @param {string} fileName - Name of the file (with or without .dcm extension)
 * @param {Uint8Array|Blob} blobData - The DICOM data as a byte array or Blob
 * @param {boolean} isEdited - Flag indicating if the file has been edited (affects filename)
 * @returns {FileData} Object with name, content (as Blob), and empty path property
 */
export function createFile(
    fileName: string,
    blobData: Blob,
    isEdited: boolean
) {
    logger.debug("Creating file object: ", fileName);

    const blob = new Blob([blobData], {
        type: "application/dicom",
    });

    const baseName = fileName.endsWith(".dcm")
        ? fileName.slice(0, -4)
        : fileName;

    const finalName = isEdited ? `${baseName}_edited.dcm` : `${baseName}.dcm`;

    logger.debug("File created: ", finalName);

    return { name: finalName, content: blob, path: "" };
}
