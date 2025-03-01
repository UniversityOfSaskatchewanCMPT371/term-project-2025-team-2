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
            const updatedFile = tagUpdater(
                dicom.DicomDataSet,
                getSingleFileTagEdits(
                    newTagValues,
                    files[currentFileIndex].name
                )
            );
            if (downloadOption === "single") {
                downloadDicomFile(createFile(files[index].name, updatedFile));
            } else {
                newFiles.push(createFile(files[index].name, updatedFile));
            }
        });
    } else {
        dicomData.forEach((dicom, index) => {
            const updatedFile = tagUpdater(
                dicom.DicomDataSet,
                getSingleFileTagEdits(newTagValues, files[index].name)
            );
            if (downloadOption === "single") {
                downloadDicomFile(createFile(files[index].name, updatedFile));
            } else {
                newFiles.push(createFile(files[index].name, updatedFile));
            }
        });
    }

    if (downloadOption === "zip") {
        const zipFile = await createZipFromFiles(newFiles);
        downloadDicomFile({ name: "updateDicoms.zip", content: zipFile });
    }
};
