/**
 * Builds a folder structure from an array of File objects using webkitRelativePath
 *
 * @param fileArray - Array of File objects
 * @returns An object mapping folder paths to arrays of Files
 */
export function buildFileStructure(fileArray: File[]): Record<string, File[]> {
    const fileStructure: Record<string, File[]> = {};

    fileArray.forEach((file) => {
        const path = (file as any).webkitRelativePath || "";
        const directory = path.split("/").slice(0, -1).join("/") || "root";

        if (!fileStructure[directory]) {
            fileStructure[directory] = [];
        }

        fileStructure[directory].push(file);
    });

    return fileStructure;
}
