import { parseDicomFile } from "../../../src/components/DicomData/DicomParserUtils";
import dicomParser from "dicom-parser";
import { jest } from "@jest/globals";

jest.mock("dicom-parser", () => {
    return {
        parseDicom: jest.fn(),
    };
});

<<<<<<<< HEAD:tests/jest/DicomParserUtils.test.ts
jest.mock("../../src/tagDictionary/dictionary", () => ({
========
// Mock TagDictionary
jest.mock("../../../src/tagDictionary/dictionary", () => ({
>>>>>>>> fix/separete_jest:tests/jest/unitTest/DicomParserUtils.test.tsx
    TagDictionary: class {
        lookup(tag: string) {
            return (
                {
                    "0040A730": "Content Sequence",
                    "00080100": "Code Value",
                    "00080102": "Coding Scheme Designator",
                }[tag] || "Unknown"
            );
        }
        lookupTagName(tag: string) {
            return this.lookup(tag);
        }
        lookupTagVR(tag: string) {
            return (
                {
                    "00100010": "PN",
                    "00100020": "LO",
                    "00100030": "DA",
                }[tag] || "Unknown"
            );
        }
    },
}));

describe("DicomParserUtils", () => {
    let mockFile: File;

    beforeEach(() => {
        // Create a mock DICOM file
        mockFile = new File([new ArrayBuffer(10)], "test.dcm", {
            type: "application/dicom",
        });
    });

    /***** UNIT-INTEGRATION TEST: Should call dicomParser *****/
    test("calls dicomParser.parseDicom when file is valid", async () => {
        const mockDataset = {
            elements: {
                "00100010": { vr: "PN" },
            },
            string: jest.fn(() => "John Doe"),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        await parseDicomFile(mockFile);

        expect(dicomParser.parseDicom).toHaveBeenCalled();
    });

    /***** UNIT TEST: Should reject on parsing errors *****/
    test("rejects if dicomParser throws an error", async () => {
        (dicomParser.parseDicom as jest.Mock).mockImplementation(() => {
            throw new Error("Parsing Error");
        });

        await expect(parseDicomFile(mockFile)).rejects.toEqual(
            "Error parsing DICOM file: Error: Parsing Error"
        );
    });

    /***** UNIT TEST: Should reject on file reading error *****/
    test("rejects if FileReader encounters an error", async () => {
        const mockFileReader = jest
            .spyOn(global, "FileReader")
            .mockImplementation(() => {
                const fileReaderInstance = {
                    onerror: null as ((event: Event) => void) | null,
                    readAsArrayBuffer: jest.fn(() => {
                        if (fileReaderInstance.onerror) {
                            fileReaderInstance.onerror(new Event("error"));
                        }
                    }),
                };
                return fileReaderInstance as unknown as FileReader;
            });

        await expect(parseDicomFile(mockFile)).rejects.toEqual(
            "File reading error occurred."
        );

        mockFileReader.mockRestore();
    });

    /***** UNIT-INTEGRATION TEST: extract hidden DICOM tags correctly *****/
    test("extracts hidden DICOM tags correctly", async () => {
        const mockDataset = {
            elements: {
                X0025101B: { vr: "UI" },
                X00431029: { vr: "UI" },
            },
            string: jest.fn((tag) =>
                tag === "00100010" ? "John Doe" : "Some Value"
            ),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        const result = await parseDicomFile(mockFile);

        Object.keys(mockDataset.elements).forEach((tag) => {
            expect(result.tags[tag]).toEqual({
                tagId: tag,
                tagName: "Unknown",
                value: "Some Value",
                hidden: true,
            });
        });
    });

    /***** UNIT-INTEGRATION TEST: Should extract nested sequence items correctly *****/
    test("extracts nested DICOM sequence (SQ) items", async () => {
        const mockDataset = {
            elements: {
                "0040A730": {
                    vr: "SQ",
                    items: [
                        {
                            dataSet: {
                                elements: {
                                    "00080100": {
                                        vr: "SH",
                                        dataOffset: 0,
                                        length: 10,
                                    },
                                    "00080102": {
                                        vr: "SH",
                                        dataOffset: 10,
                                        length: 10,
                                    },
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
            tagName: "Code Value",
            value: "12345",
        });

        expect(result.tags["0040A730"].value.tags["00080102"]).toEqual({
            tagId: "00080102",
            tagName: "Coding Scheme Designator",
            value: "LOINC",
        });
    });

    /***** UNIT-INTEGRATION TEST: extract values from multiple DICOM tags *****/
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
