import { tagUpdater} from '../../../src/components/DicomData/TagUpdater';
import { parseDicomFile } from '../../../src/components/DicomData/DicomParserUtils';
import { DicomData } from '../../../src/types/DicomTypes';

function createFileObj(path: string, name: string): File | null {
    const fs = require('fs');
    try {
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
        let updatedFile = tagUpdater(sampleDicomData.DicomDataSet, []);
        expect(updatedFile).toEqual(sampleDicomData.DicomDataSet.byteArray);
    });

    // 1 tag value update - beginning, end, middle, value >> (value can never be too big), value <<
    test('Updated 1 tag value', async() => {
        
        // get the edited dicom file from pydicom generater

        // update initial dicom file with tag updater

        // check if edited dicom file matches the output of tag updater

    });

    // 2 tag value updates that are not next to each other

    // 2 tag value updates that are next to each other
});

describe('insertTag() unit tests', () => {
    test('insert tag value', () => {
        // expect(tagUpdaterFuncs.insertTag())
        console.log('insert tag value');
    });
});