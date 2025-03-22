import { tagUpdater } from "../../../../src/DataFunctions/DicomData/TagUpdater";
import { DicomData } from "../../../../src/Features/DicomTagTable/Types/DicomTypes";
import { parseDicomFile } from "../../../../src/DataFunctions/DicomData/DicomParserUtils";
import dicomParser from "dicom-parser";

function createFileObj(path: string, name: string): File | null {
    try {
        const fs = require("fs");
        const fileBuffer = fs.readFileSync(path);
        const file = new File([fileBuffer], name, {
            type: "application/dicom",
        });

        return file;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}

describe("tagUpdater (add = true)", () => {
    let sampleDicomData: DicomData;
    const filename = "test_dicom_0.dcm";
    beforeEach(async () => {
        const dicomFile = createFileObj(
            "test-data/test_dicoms/gen_dicom_files/simple_files/" + filename,
            filename
        );
        if (dicomFile === null) {
            console.error("Error reading file in TagUpdater unit tests");
            return;
        }
        await parseDicomFile(dicomFile)
            .then((dicomData) => {
                sampleDicomData = dicomData;
            })
            .catch((error) => {
                console.error(
                    "Error parsing DICOM file in TagUpdater unit tests:",
                    error
                );
            });
    });

    test("should add a new tag to the dicom dataset", () => {
        const newTag = {
            tagId: "x99999999",
            newValue: "John Doe is added",
            add: true,
            delete: false,
        };

        const updatedBuffer = tagUpdater(sampleDicomData.DicomDataSet, [
            newTag,
        ]);

        const updated = dicomParser.parseDicom(updatedBuffer);

        const name = updated.string("x99999999");
        expect(name).toBe("John Doe is added");
    });

    test("should add multiple new tags to the DICOM dataset", () => {
        const newTags = [
            {
                tagId: "x88881111",
                newValue: "Multi Tag One",
                add: true,
                delete: false,
            },
            {
                tagId: "x88882222",
                newValue: "Multi Tag Two",
                add: true,
                delete: false,
            },
        ];

        const updatedBuffer = tagUpdater(sampleDicomData.DicomDataSet, newTags);
        const updated = dicomParser.parseDicom(updatedBuffer);

        expect(updated.string("x88881111")).toBe("Multi Tag One");
        expect(updated.string("x88882222")).toBe("Multi Tag Two");
    });

    // test("should handle adding a numeric tag (US VR)", () => {
    //     const newTag = {
    //         tagId: "x00280100",
    //         newValue: "16",
    //         add: true,
    //         delete: false,
    //     };

    //     const updatedBuffer = tagUpdater(sampleDicomData.DicomDataSet, [
    //         newTag,
    //     ]);
    //     const updated = dicomParser.parseDicom(updatedBuffer);

    //     const bitsAllocated = updated.uint16("x00280100");
    //     expect(bitsAllocated).toBe(16);
    // });

    test("should handle adding a float tag (FL VR)", () => {
        const newTag = {
            tagId: "x00280102",
            newValue: "3.14",
            add: true,
            delete: false,
        };

        const updatedBuffer = tagUpdater(sampleDicomData.DicomDataSet, [
            newTag,
        ]);
        const updated = dicomParser.parseDicom(updatedBuffer);

        const floatVal = updated.floatString("x00280102");
        expect(floatVal).toBe(3.14);
    });

    test("should ignore empty newTagData array and return original buffer", () => {
        const originalBuffer = sampleDicomData.DicomDataSet.byteArray;
        const result = tagUpdater(sampleDicomData.DicomDataSet, []);
        expect(result).toEqual(originalBuffer);
    });

    test("should throw error for malformed input (missing tagId)", () => {
        const brokenTag = {
            tagID: "",
            newValue: "Oops",
            add: true,
            delete: false,
        };

        expect(() => {
            tagUpdater(sampleDicomData.DicomDataSet, [brokenTag]);
        }).toThrow();
    });
});
