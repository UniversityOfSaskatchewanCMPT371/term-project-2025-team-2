import { TagsAnon } from "./TagsAnon";
import { tagUpdater } from "../../../DataFunctions/DicomData/TagUpdater";
import {
    createFile,
    createZipFromFiles,
    downloadDicomFile,
} from "../../../DataFunctions/DicomData/DownloadFuncs";
import { CustomFile } from "../../FileHandling/Types/FileTypes";
import { AnonTag } from "../../DicomTagTable/Types/DicomTypes";

/**
 * @description format the data to be used in the tagUpdater function
 * @param dicomData
 * @returns formatted data
 */
export function FormatData(dicomData: any) {
    const newDicomData: any = [];

    TagsAnon.forEach((tag: any) => {
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
 *
 * @description auto anonymize the dicom files
 * @param dicomData
 * @param files
 * @returns none
 */
export const AutoAnon = async (
    dicomData: any[],
    files: CustomFile[],
    anonTags: AnonTag[]
) => {
    const newFiles: any = [];

    dicomData.forEach((dicom: any, index: number) => {
        const formatedData = FormatData(dicom);

        // Update the formatted data with the new values from anonTags
        anonTags.forEach((anonTag) => {
            const tagIndex = formatedData.findIndex(
                (tag: any) => tag.tagId === anonTag.tagId
            );
            if (tagIndex !== -1) {
                formatedData[tagIndex].newValue = anonTag.newValue;
            }
        });

        const updatedFile = tagUpdater(dicomData[0].DicomDataSet, formatedData);

        newFiles.push(createFile(files[index].name, updatedFile));
    });

    const zipFile = await createZipFromFiles(newFiles);
    downloadDicomFile({ name: "updateDicoms.zip", content: zipFile });
};
