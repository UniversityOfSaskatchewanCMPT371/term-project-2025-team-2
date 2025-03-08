import { parseDicomFile } from "@components/DicomData/DicomParserUtils";
import dicomParser from "dicom-parser";
import { jest } from "@jest/globals";

jest.mock("dicom-parser", () => ({
    parseDicom: jest.fn(),
}));

describe("DicomParserUtils Integration Tests", () => {
    let mockFile: File;

    beforeEach(() => {
        mockFile = new File([new ArrayBuffer(10)], "test.dcm", {
            type: "application/dicom",
        });
    });

    test("calls dicomParser.parseDicom when file is valid", async () => {
        const mockDataset = {
            elements: {
                "00100010": { vr: "PN" }, // Patient Name
            },
            string: jest.fn(() => "John Doe"),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        await parseDicomFile(mockFile);

        expect(dicomParser.parseDicom).toHaveBeenCalled();
    });

    test("extracts hidden DICOM tags correctly", async () => {
        const mockDataset = {
            elements: {
                X0025101B: { vr: "UI" }, // Hidden Tag (should be hidden)
                X00431029: { vr: "UI" }, // Hidden Tag (should be hidden)
            },
            string: jest.fn((tag) =>
                tag === "00100010" ? "John Doe" : "Some Value"
            ),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        const result = await parseDicomFile(mockFile); // invokes extractDicomTags

        Object.keys(mockDataset.elements).forEach((tag) => {
            expect(result.tags[tag]).toEqual({
                tagId: tag,
                tagName: "Unknown",
                value: "Some Value",
                hidden: true,
            });
        });
    });

    test("extracts nested DICOM sequence (SQ) items", async () => {
        const mockDataset = {
            elements: {
                "0040A730": {
                    // Content Sequence (SQ)
                    vr: "SQ",
                    items: [
                        {
                            dataSet: {
                                elements: {
                                    "00080100": {
                                        vr: "SH",
                                        dataOffset: 0,
                                        length: 10,
                                    }, // CodeValue
                                    "00080102": {
                                        vr: "SH",
                                        dataOffset: 10,
                                        length: 10,
                                    }, // CodingSchemeDesignator
                                },
                                string: jest.fn((tag) => {
                                    if (tag === "00080100") return "12345";
                                    if (tag === "00080102") return "LOINC";
                                    return null;
                                }),
                            },
                        },
                    ],
                },
            },
            byteArray: new Uint8Array(128), 
            string: jest.fn(() => null),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        const result = await parseDicomFile(mockFile); 

        expect(result.tags["0040A730"].value.tags["00080100"]).toEqual({
            tagId: "00080100",
            tagName: "Unknown",
            value: "12345",
        });

        expect(result.tags["0040A730"].value.tags["00080102"]).toEqual({
            tagId: "00080102",
            tagName: "Unknown",
            value: "LOINC",
        });
    });

    test("extracts values from multiple DICOM tags", async () => {
        const mockDataset = {
            elements: {
                "00100010": { vr: "PN" }, 
                "00100020": { vr: "LO" }, 
                "00100030": { vr: "DA" }, 
            },
            string: jest.fn((tag) => {
                if (tag === "00100010") return "Aladin Alihodzic";
                if (tag === "00100020") return "101010";
                if (tag === "00100030") return "19960309";
                return "N/A";
            }),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        const result = await parseDicomFile(mockFile);

        expect(result.tags["00100010"].value).toBe("Aladin Alihodzic");
        expect(result.tags["00100020"].value).toBe("101010");
        expect(result.tags["00100030"].value).toBe("19960309");
    });
});
