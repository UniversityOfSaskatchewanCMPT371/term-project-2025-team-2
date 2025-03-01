import { FormatData } from "../../src/components/Auto/AutoClean";

describe("FormatData", () => {
    it("should correctly format DICOM data based on Test_TagsAnon", () => {
        const dicomData = {
            DicomDataSet: {
                elements: {
                    x00080080: { vr: "LO", dataOffset: 128 },
                    x00100010: { vr: "PN", dataOffset: 256 },
                    x00100020: { vr: "LO", dataOffset: 512 },
                },
            },
        };

        const result = FormatData(dicomData);

        expect(result).toEqual([
            {
                tagId: "X00080080",
                newValue: "ANONYMOUS",
                vr: "LO",
                dataOffSet: 128,
                length: 9,
                deleteTag: false,
            },
        ]);
    });

    it("should not add a tag if the tagId is not in dicomData", () => {
        const dicomData = {
            DicomDataSet: {
                elements: {
                    x00080081: { vr: "LO", dataOffset: 128 },
                    x00100010: { vr: "PN", dataOffset: 256 },
                },
            },
        };

        const result = FormatData(dicomData);

        expect(result).toEqual([]);
    });

    it('should use "UN" as vr if not provided in dicomData', () => {
        const dicomData = {
            DicomDataSet: {
                elements: {
                    x00080080: { dataOffset: 128 },
                },
            },
        };

        const result = FormatData(dicomData);

        expect(result).toEqual([
            {
                tagId: "X00080080",
                newValue: "ANONYMOUS",
                vr: "UN",
                dataOffSet: 128,
                length: 9,
                deleteTag: false,
            },
        ]);
    });

    it("should use 0 as dataOffset if not provided in dicomData", () => {
        const dicomData = {
            DicomDataSet: {
                elements: {
                    x00080080: { vr: "LO" },
                },
            },
        };

        const result = FormatData(dicomData);

        expect(result).toEqual([
            {
                tagId: "X00080080",
                newValue: "ANONYMOUS",
                vr: "LO",
                dataOffSet: 0,
                length: 9,
                deleteTag: false,
            },
        ]);
    });
});
