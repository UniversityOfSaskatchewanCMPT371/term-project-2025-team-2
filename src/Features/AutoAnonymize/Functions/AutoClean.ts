import { tagUpdater } from "@dataFunctions/DicomData/TagUpdater";
import {
    createFile,
    createZipFromFiles,
    downloadDicomFile,
} from "@dataFunctions/DicomData/DownloadFuncs";
import { CustomFile } from "@features/FileHandling/Types/FileTypes";
import { AnonTag } from "@features/DicomTagTable/Types/DicomTypes";
import { useStore } from "@state/Store";
import logger from "@logger/Logger";

/**
 * Formate the data to be used in the tagUpdater function
 * @description format the data to be used in the tagUpdater function
 * @precondition dicomData must be an object
 * @postcondition formatted data is returned
 * @param dicomData
 * @returns formatted data
 */
export function FormatData(dicomData: any, tagsToAnon: any[]) {
    const newDicomData: any = [];

    tagsToAnon.forEach((tag: any) => {
        if (!dicomData.DicomDataSet.elements[tag.tagId.toLowerCase()]) {
            return;
        }

        const tagData = {
            tagId: tag.tagId,
            newValue: tag.value,
            vr:
                dicomData.DicomDataSet.elements[tag.tagId.toLowerCase()].vr ||
                "NO",
            dataOffSet:
                dicomData.DicomDataSet.elements[tag.tagId.toLowerCase()]
                    .dataOffset,
            length: tag.value.length,
            deleteTag: false,
        };
        newDicomData.push(tagData);
    });

    return newDicomData;
}

/**
 * Auto anonymize the dicom files
 * @description auto anonymize the dicom files
 * @precondition dicomData must be an array of objects, files must be an array of objects
 * @postcondition new files are created and downloaded
 * @param dicomData
 * @param files
 * @returns none
 */
export const AutoAnon = async (
    dicomData: any[],
    files: CustomFile[],
    anonTags: AnonTag[],
    tagsToAnon: any[]
) => {
    const newFiles: any = [];
    const { setLoading } = useStore.getState();
    
    try {
        setLoading(true);
        dicomData.forEach((dicom: any, index: number) => {
            const formattedData = FormatData(dicom, tagsToAnon);

            // Update the formatted data with the new values from anonTags
            anonTags.forEach((anonTag) => {
                const tagIndex = formattedData.findIndex(
                    (tag: any) => tag.tagId === anonTag.tagId
                );
                if (tagIndex !== -1) {
                    formattedData[tagIndex].newValue = anonTag.newValue;
                }
            });

            const updatedFile = tagUpdater(dicomData[0].DicomDataSet, formattedData);

            newFiles.push(createFile(files[index].name, updatedFile, true));
        });

        const zipFile = await createZipFromFiles(newFiles);
        downloadDicomFile({ name: "updateDicoms.zip", content: zipFile });
    } catch (err) {
        logger.error("Auto anonymization failed:", err);
    } finally {
        setLoading(false);
    }
};
