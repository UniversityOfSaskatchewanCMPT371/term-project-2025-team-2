import { TagsAnon } from "./TagsAnon";
import { tagUpdater } from "../DicomData/TagUpdater";
import {
    createFile,
    downloadDicomFile,
} from "../DicomData/DownloadFuncs";
import { CustomFile } from "../../types/FileTypes";

/**
 * @description format the data to be used in the tagUpdater function
 * @param dicomData
 * @returns formatted data
 */
export function FormatData(dicomData: any, tag: any) {
    const newDicomData: any = [];

    // tags.forEach((tag: any) => {
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
    // });

    return newDicomData;
}

/**
 *
 * @description auto anonymize the dicom files
 * @param dicomData
 * @param files
 * @returns none
 */
export const AutoAnon = async (dicomData: any[], files: CustomFile[]) => {
    // const newFiles: any = [];

    TagsAnon.forEach((tag: any) => {
        
        // console.log("tag", tag);
        
        const formatedData = FormatData(dicomData[0], tag);
        let newFile: any;
        
       
        if(!formatedData) {
            return;
        }
        console.log("tag update ", formatedData);
        // dicomData.forEach((dicom: any, index: number) => {
        const updatedFile = tagUpdater(dicomData[0].DicomDataSet, formatedData);

        newFile = createFile(tag.tagId + "_" + formatedData[0].vr, updatedFile);
        // newFiles.push(createFile(files[index].name, updatedFile));
        // });

        downloadDicomFile(newFile);
    });
    // const zipFile = await createZipFromFiles(newFiles);
    // downloadDicomFile({ name: "updateDicoms.zip", content: zipFile });
};
