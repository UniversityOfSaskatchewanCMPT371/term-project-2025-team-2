import { parseDicomFile } from "@dataFunctions/DicomData/DicomParserUtils";

/**
 * Parses an array of DICOM files and returns structured results.
 *
 * @param fileArray - Array of File objects to parse
 * @param parseDicomFileFn - Function to parse individual DICOM files
 * @param toggleModal - Callback for showing error modal
 * @param onError - Callback for each failed file (receives file name)
 * @param onProgress - Optional callback for tracking progress
 * @returns Array of parsed DICOM data or null for failed parses
 */
export async function parseDicomFiles(
    fileArray: File[],
    parseDicomFileFn: typeof parseDicomFile,
    toggleModal: () => void,
    onError: (fileName: string) => void,
    onProgress?: (current: number, total: number) => void
) {
    const results = await Promise.all(
        fileArray.map((file, index) =>
            parseDicomFileFn(file)
                .then((data) => {
                    if (onProgress) onProgress(index + 1, fileArray.length);

                    const path = (file as any).webkitRelativePath || file.name;

                    return {
                        ...data,
                        filePath: path,
                        fileName: file.name,
                    };
                })
                .catch(() => {
                    onError(file.name);
                    toggleModal();
                    return null;
                })
        )
    );

    return results;
}
