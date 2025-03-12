import { createFile, downloadDicomFile } from "./DownloadFuncs";
import { createZipFromFiles } from "./DownloadFuncs";
import { tagUpdater, getSingleFileTagEdits } from "./TagUpdater";

/**
 * Updates and downloads all files, either as individual or zip.
 * Pops error modal if no files have edits.
 * @returns boolean indicating whether any edits were found
 */
export const updateAllFiles = async (
    dicomData: any[],
    series: boolean,
    newTagValues: any[],
    files: { name: string }[],
    currentFileIndex: number,
    downloadOption: string,
    setShowNoEditsModal: (show: boolean) => void
): Promise<boolean> => {
    const newFiles: any[] = [];

    if (series) {
        const edits = getSingleFileTagEdits(newTagValues, files[currentFileIndex].name);

        if (edits.length === 0) {
            setShowNoEditsModal(true);
            return false;
        }

        dicomData.forEach((dicom: any, index: number) => {
            const updatedFile = tagUpdater(dicom.DicomDataSet, edits);
            if (downloadOption === "single") {
                downloadDicomFile(createFile(files[index].name, updatedFile));
            } else {
                newFiles.push(createFile(files[index].name, updatedFile));
            }
        });

    } else {
        let editedFileCount = 0;

        for (let i = 0; i < dicomData.length; i++) {
            const edits = getSingleFileTagEdits(newTagValues, files[i].name);

            if (edits.length > 0) {
                editedFileCount++;
                const updatedFile = tagUpdater(dicomData[i].DicomDataSet, edits);
                if (downloadOption === "single") {
                    downloadDicomFile(createFile(files[i].name, updatedFile));
                } else {
                    newFiles.push(createFile(files[i].name, updatedFile));
                }
            }
        }

        if (editedFileCount === 0) {
            setShowNoEditsModal(true);
            return false;
        }
    }

    if (downloadOption === "zip") {
        const zipFile = await createZipFromFiles(newFiles);
        downloadDicomFile({ name: "updateDicoms.zip", content: zipFile });
    }

    return true;
};
