import JSZip from "jszip";
import { FileData } from "../../Features/FileHandling/Types/FileTypes";

/**
 * Creates a ZIP file containing multiple files
 * @param files - Array of files with name and content
 * @returns Promise resolving to the ZIP file as a Blob
 */

export async function createZipFromFiles(files: FileData[]): Promise<Blob> {
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

        return zipBlob;
    } catch (error) {
        throw new Error(`Failed to create ZIP: ${error}`);
    }
} /**
 * @description - Download the dicom file, single file
 * @param blobData - The dicom data object, byteArray
 * @param fileName - string name of the file
 */

export async function downloadDicomFile(newFile: FileData) {
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
 * @description - Create a new file object
 * @param fileName - string name of the file
 * @param blobData - The dicom data object, byteArray
 * @returns - object with name and content of the file
 */

export function createFile(fileName: string, blobData: any) {
    const blob = new Blob([blobData], {
        type: "application/dicom",
    });

    const newFileName = fileName.includes(".dcm")
        ? fileName.slice(0, -4)
        : fileName;

    return { name: newFileName + "_edited.dcm", content: blob };
}
