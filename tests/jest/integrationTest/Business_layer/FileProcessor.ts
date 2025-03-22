// Extracted File Processing logic from FileUploader.tsx to do integration test
// Core logic is the same, just removed the UI related code

import { parseDicomFile } from "../../../../src/DataFunctions/DicomData/DicomParserUtils";
import { DicomData } from "../../../../src/Features/DicomTagTable/Types/DicomTypes";

export type FileStructure = Record<string, File[]>;

interface FileWithPath extends File {
    webkitRelativePath: string;
}

export const processFiles = async (
    fileArray: FileWithPath[],
    existingFileStructure?: FileStructure
): Promise<{
    structuredFiles: FileStructure;
    parsedData: DicomData[];
}> => {
    fileArray.sort((a, b) => {
        const pathA = a.webkitRelativePath || a.name;
        const pathB = b.webkitRelativePath || b.name;
        return pathA.localeCompare(pathB, undefined, {
            numeric: true,
            sensitivity: "base",
        });
    });

    const fileStructureTemp: FileStructure = existingFileStructure || {};

    if (!existingFileStructure) {
        fileArray.forEach((file) => {
            const path = file.webkitRelativePath || "";
            const directory = path.split("/").slice(0, -1).join("/") || "root";
            if (!fileStructureTemp[directory]) {
                fileStructureTemp[directory] = [];
            }
            fileStructureTemp[directory].push(file);
        });
    }

    const promises = fileArray.map((file) =>
        parseDicomFile(file)
            .then((data) => ({ ...data }))
            .catch(() => null)
    );

    const dicomDataArray = await Promise.all(promises);
    const validData = dicomDataArray.filter((d): d is DicomData => d !== null);

    return {
        structuredFiles: fileStructureTemp,
        parsedData: validData,
    };
};
