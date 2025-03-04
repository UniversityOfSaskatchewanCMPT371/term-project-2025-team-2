import { tagUpdater} from '../../../src/components/DicomData/TagUpdater';
import { parseDicomFile } from '../../../src/components/DicomData/DicomParserUtils';
import { DicomData } from '../../../src/types/DicomTypes';

//const tagUpdaterFuncs = require('../../../src/components/DicomData/TagUpdater');

function createFile(path: string, name: string): File | null {      // , type: string
    // let response = await fetch(path);
    // let data = await response.blob();
    // let metadata = {
    //     type: type
    // };
    // return new File([data], name, metadata);
    const fs = require('fs');
    try {
        const fileBuffer = fs.readFileSync(path);
        const file = new File([fileBuffer], name, {
            type: 'application/dicom', // Set appropriate MIME type, adjust based on the file type
        });
    
        return file;
      } catch (error) {
        console.error('Error reading file:', error);
        return null;
      }
}

describe('TagUpdater unit tests', () => {
    let sampleDicomData: DicomData;
    beforeEach(() => {
        // await createFile('test-data/test_dicoms/gen_dicom_files/test_dicom_0.dcm', 'test_dicom_0.dcm').then((file) => {     //, 'application/dicom'
        //     if (file === null) {
        //         console.error('Error reading file in TagUpdater unit tests');
        //         return;
        //     }
        //     sampleDicomData = parseDicomFile(file);
        // });

        // const dicomFile = createFile('test-data/test_dicoms/gen_dicom_files/test_dicom_0.dcm', 'test_dicom_0.dcm');
        // if (dicomFile === null) {
        //     console.error('Error reading file in TagUpdater unit tests');
        //     return;
        // }
        // parseDicomFile(dicomFile)
        // .then((dicomData) => {
        //     sampleDicomData = dicomData;
        // })
        // .catch((error) => {
        //     console.error('Error parsing DICOM file in TagUpdater unit tests:', error);
        // });
    });

    // No tag value updates
    test('no tag value updates', async() => {
        const dicomFile = createFile('test-data/test_dicoms/gen_dicom_files/test_dicom_0.dcm', 'test_dicom_0.dcm');
        if (dicomFile === null) {
            console.error('Error reading file in TagUpdater unit tests');
            return;
        }
        await parseDicomFile(dicomFile)
        .then((dicomData) => {
            sampleDicomData = dicomData;
        })
        .catch((error) => {
            console.error('Error parsing DICOM file in TagUpdater unit tests:', error);
        });

        let updatedFile = tagUpdater(sampleDicomData.DicomDataSet, []);
        expect(updatedFile).toEqual(sampleDicomData.DicomDataSet.byteArray);
    });

    // 1 tag value update

    // 2 tag value updates
});

describe('insertTag() unit tests', () => {
    test('insert tag value', () => {
        // expect(tagUpdaterFuncs.insertTag())
        console.log('insert tag value');
    });
});