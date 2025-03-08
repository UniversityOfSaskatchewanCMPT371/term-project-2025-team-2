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

function compareDicomTags(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
    let result: boolean = true;
    Object.entries(obj1).map(([key, value1]) => {
      const value2 = obj2[key];
      let equal: boolean;
      
      if (value1 === null || value2 === null) {
        equal = value1 === value2;
      } else if (typeof value1 === 'object' && typeof value2 === 'object') {
        equal = JSON.stringify(value1) === JSON.stringify(value2);
      } else {
        equal = value1 === value2;
      }
      result = result && equal;
    });
    return result;
}

function extractTagsFromByteArray(fileData: Uint8Array) {
    try {
        const dataSet = dicomParser.parseDicom(fileData);
        return extractDicomTags(dataSet);
    }
    catch (error) {
        console.log("Error parsing DICOM file: ", error);
    }
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
    test('No tag value updates', async() => {
        const newValues: TableUpdateData[] = []
        let updatedFile: Uint8Array = tagUpdater(sampleDicomData.DicomDataSet, newValues);
        expect(updatedFile).toEqual(sampleDicomData.DicomDataSet.byteArray);
    });

    test('Update 1 tag value', async() => {        
        // get the edited dicom file from pydicom generater
        let expectedDicomData: DicomData;
        let filename: string = 'test_dicom_0_editName.dcm';
        
        const expectedDicomFile = createFileObj('test-data/test_dicoms/gen_dicom_files/' + filename, filename);
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
        let updatedFileData: Uint8Array = tagUpdater(sampleDicomData.DicomDataSet, newValues);
        
        // Get dicom data from expected file and compare with updated file
        await parseDicomFile(expectedDicomFile)
        .then((dicomData) => {
            expectedDicomData = dicomData;
            dicomData = extractTagsFromByteArray(updatedFileData);
            expect(compareDicomTags(expectedDicomData.tags, dicomData.tags)).toBe(true);
        })
    });

    test('Update 2 tag values', async() => {        
        // get the edited dicom file from pydicom generater
        let expectedDicomData: DicomData;
        let filename: string = 'test_dicom_0_editNameID.dcm';
        const expectedDicomFile = createFileObj('test-data/test_dicoms/gen_dicom_files/' + filename, filename);
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
        }, {
            fileName: 'test_dicom_0.dcm',
            tagId: 'X00100020',
            newValue: '1010',
            delete: false
        }]
        let updatedFileData: Uint8Array = tagUpdater(sampleDicomData.DicomDataSet, newValues);
        
        // Get dicom data from expected file and compare with updated file
        await parseDicomFile(expectedDicomFile)
        .then((dicomData) => {
            expectedDicomData = dicomData;
            dicomData = extractTagsFromByteArray(updatedFileData);
            expect(compareDicomTags(expectedDicomData.tags, dicomData.tags)).toBe(true);
        })
    });

    
});