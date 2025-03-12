import { createFile, downloadDicomFile } from "./DownloadFuncs";
import { createZipFromFiles } from "./DownloadFuncs";
import { tagUpdater } from "./TagUpdater";
import { getSingleFileTagEdits } from "./TagUpdater";

export const updateAllFiles = async (
    dicomData: any[],
    series: any,
    newTagValues: any,
    files: { name: string }[],
    currentFileIndex: number,
    downloadOption: string
) => {
    const newFiles: any = [];

    if (series) {
        dicomData.forEach((dicom: any, index: number) => {
            const fileName = files[index].name;
            const fileEdits = getSingleFileTagEdits(newTagValues, files[currentFileIndex].name);
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
        const zipFile = await createZipFromFiles(newFiles);
        downloadDicomFile({ name: "updateDicoms.zip", content: zipFile });
    }
};
