import { tagUpdater} from '../../../src/components/DicomData/TagUpdater';
import { parseDicomFile, extractDicomTags } from '../../../src/components/DicomData/DicomParserUtils';
import { DicomData, TableUpdateData } from '../../../src/types/DicomTypes';
import dicomParser from "dicom-parser";

function createFileObj(path: string, name: string): File | null {
    try {
        const fs = require('fs');
        const fileBuffer = fs.readFileSync(path);
        const file = new File([fileBuffer], name, {
            type: 'application/dicom',
        });
    
        return file;
      } catch (error) {
        console.error('Error reading file:', error);
        return null;
      }
}

// export const isFileEqual = async (file1: Blob, file2: Blob): Promise<boolean> => {
//   return new Promise<boolean>((resolve) => {
//     blobCompare.isEqual(file1, file2)
//       .then((result: boolean) => {
//         resolve(result);
//       })
//       .catch(() => resolve(false));
//   });
// };

function compareStructures(obj1: Record<string, any>, obj2: Record<string, any>): boolean { //{key: string, equal: boolean, value1: any, value2: any}[]
    let result: boolean = true;
    Object.entries(obj1).map(([key, value1]) => {
      const value2 = obj2[key];
      let equal: boolean;
      
      if (value1 === null || value2 === null) {
        equal = value1 === value2;
      } else if (typeof value1 === 'object' && typeof value2 === 'object') {
        // For nested objects, you could recursively call compareStructures
        // or do a simpler comparison with JSON.stringify
        equal = JSON.stringify(value1) === JSON.stringify(value2);
      } else {
        equal = value1 === value2;
      }
      result = result && equal;
      
    //   return {
    //     key,
    //     equal,
    //     value1,
    //     value2
    //   };
    });
    return result;
  }

describe('TagUpdater unit tests', () => {
    let sampleDicomData: DicomData;
    beforeEach(async() => {
        // make a File from the test DICOM file
        const dicomFile = createFileObj('test-data/test_dicoms/gen_dicom_files/test_dicom_0.dcm', 'test_dicom_0.dcm');
        if (dicomFile === null) {
            console.error('Error reading file in TagUpdater unit tests');
            return;
        }
        // parse dicom File
        await parseDicomFile(dicomFile)
        .then((dicomData) => {
            sampleDicomData = dicomData;
        })
        .catch((error) => {
            console.error('Error parsing DICOM file in TagUpdater unit tests:', error);
        });

    });

    // No tag value updates
    test('no tag value updates', async() => {
        const newValues: TableUpdateData[] = []
        let updatedFile = tagUpdater(sampleDicomData.DicomDataSet, newValues);
        expect(updatedFile).toEqual(sampleDicomData.DicomDataSet.byteArray);
    });

    // 1 tag value update - beginning, end, middle, value >> (value can never be too big), value <<
    test('Updated 1 tag value', async() => {
        //console.log(sampleDicomData.tags);

        // get tags from orginal dicom file
        // const expectedfilename = 'test_dicom_0_expected';
        // const expectedMediaSOPInstUID = sampleDicomData.tags['X00080016'].value;
        // const expectedPname = sampleDicomData.tags['X00100010'].value;
        // const expectedPtID = sampleDicomData.tags['X00100020'].value;
        // const expectedMod = sampleDicomData.tags['X00080060'].value;
        // const expectedStudyDate = sampleDicomData.tags['X00080020'].value;
        // const expectedSeriesUID = sampleDicomData.tags['X0020000E'].value;
        // const expectedStudyUID = sampleDicomData.tags['X0020000D'].value;
        // const expectedSOPInstUID = sampleDicomData.tags['X00080018'].value;
        
        // get the edited dicom file from pydicom generater
        let expectedDicomData: DicomData;
        const expectedDicomFile = createFileObj('test-data/test_dicoms/gen_dicom_files/test_dicom_0_edited.dcm', 'test_dicom_0_edited.dcm');
        if (expectedDicomFile === null) {
            console.error('Error reading file in TagUpdater unit tests');
            return;
        }

        // update initial dicom file with tag updater
        const newValues: TableUpdateData[] = [{
            fileName: 'test_dicom_0.dcm',
            tagId: 'X00100010',
            newValue: 'ANONYMOUS',
            delete: false
        }]
        let updatedFileData = tagUpdater(sampleDicomData.DicomDataSet, newValues);

        // check if edited dicom file matches the output of tag updater
        
        // Option 1: get dicom data from expected file and compare
        await parseDicomFile(expectedDicomFile)
        .then((dicomData) => {
            expectedDicomData = dicomData;
            try {
                const dataSet = dicomParser.parseDicom(updatedFileData);
                dicomData = extractDicomTags(dataSet);
            }
            catch (error) {
                console.log("Error parsing DICOM file: ", error);
            }
            //console.log(updatedFileData);
            //console.log("Expected: ", expectedDicomData);
            //console.log("Result: ", dicomData)
            //console.log(compareStructures(expectedDicomData.tags, dicomData.tags));
            expect(compareStructures(expectedDicomData.tags, dicomData.tags)).toBe(true);
            //expect(updatedFileData).toEqual(expectedDicomData.DicomDataSet.byteArray);
        })

        // Option 2: make a file
        // const updatedFile: File = new File([updatedFileData], "test_dicom_0_edited.dcm", { type: 'application/dicom' });
        // const result = await isFileEqual(updatedFile, expectedDicomFile);
        // expect(result).toBe(true);
    });

    // 2 tag value updates that are not next to each other

    // 2 tag value updates that are next to each other
});