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

    logger.debug(`Formatting data for auto anonymization - ${dicomData}`);

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
 * @description auto anonymize the dicom files and maintain folder structure
 * @precondition dicomData must be an array of objects, files must be an array of objects
 * @postcondition new files are created in original folder structure and downloaded as a zip
 * @param dicomData - Array of DICOM data objects
 * @param files - Array of original files
 * @param anonTags - Array of anonymization tags with new values
 * @param tagsToAnon - Array of tags to anonymize
 * @param folderStructure - Object mapping folder paths to their files
 * @returns void
 */
export const AutoAnon = async (
    dicomData: any[],
    files: CustomFile[],
    anonTags: AnonTag[],
    tagsToAnon: any[],
    folderStructure: Record<string, File[]>
) => {
    const { setLoading } = useStore.getState();
    const { setLoadingMsg } = useStore.getState();
    const structuredFiles: any[] = [];

    logger.debug("Auto anonymizing DICOM files");

    try {
        dicomData.forEach((dicom: any, index: number) => {
            setLoadingMsg(
                `Anonymizing file ${index + 1} of ${dicomData.length}`
            );

            const formattedData = FormatData(dicom, tagsToAnon);

            anonTags.forEach((anonTag) => {
                const tagIndex = formattedData.findIndex(
                    (tag: any) => tag.tagId === anonTag.tagId
                );
                if (tagIndex !== -1) {
                    formattedData[tagIndex].newValue = anonTag.newValue;
                } else {
                    formattedData.push({
                        tagId: anonTag.tagId,
                        newValue: anonTag.newValue,
                        vr:
                            dicom.DicomDataSet.elements[anonTag.tagId.toLowerCase()].vr ||
                            "NO",
                        dataOffSet:
                            dicom.DicomDataSet.elements[anonTag.tagId.toLowerCase()]
                                .dataOffset,
                        length: anonTag.newValue.length,
                        deleteTag: false,
                    });
                }
            });

            const updatedFile = tagUpdater(dicom.DicomDataSet, formattedData);

            const originalFile = files[index];
            const fileName = originalFile.name;

            let filePath = "";
            if (dicom.filePath) {
                filePath = dicom.filePath;

                const parts = filePath.split("/");
                parts.pop();
                filePath = parts.join("/");
            } else {
                for (const [folder, folderFiles] of Object.entries(
                    folderStructure
                )) {
                    const matchingFile = folderFiles.find(
                        (f) => f.name === fileName
                    );
                    if (matchingFile) {
                        filePath = folder === "root" ? "" : folder;
                        break;
                    }
                }
            }

            const fileWithPath = createFile(fileName, updatedFile, true);

            fileWithPath.path = filePath;

            structuredFiles.push(fileWithPath);
        });

        setLoadingMsg("Creating ZIP file");
        const zipFile = await createZipFromFiles(structuredFiles);

        downloadDicomFile({ name: "anonymized_dicoms.zip", content: zipFile });
    } catch (err) {
        logger.error("Auto anonymization failed:", err);
    } finally {
        setLoading(false);
    }
};
