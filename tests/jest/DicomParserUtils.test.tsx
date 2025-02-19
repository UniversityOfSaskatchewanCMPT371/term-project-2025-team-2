import { parseDicomFile } from "../../src/components/DicomData/DicomParserUtils";
import dicomParser from "dicom-parser";
import { jest } from "@jest/globals";

// Mock dicomParser
jest.mock("dicom-parser", () => ({
    parseDicom: jest.fn(),
}));

// Mock TagDictionary
jest.mock("../../src/tagDictionary/dictionary", () => ({
    TagDictionary: class {
        lookup(tag: string) {
            return {
                "0040A730": "Content Sequence",
                "00080100": "Code Value",
                "00080102": "Coding Scheme Designator",
            }[tag] || "Unknown";
        }
    }
}));

describe("DicomParserUtils", () => {
    let mockFile: File;

    beforeEach(() => {
        // Create a mock DICOM file
        mockFile = new File([new ArrayBuffer(10)], "test.dcm", {
            type: "application/dicom",
        });
    });

    /***** UNIT-INTEGRATION TEST: Should call dicomParser and extract tags *****/
    test("calls dicomParser.parseDicom when file is valid", async () => {
        const mockDataset = {
            elements: {
                X00100010: { vr: "PN" }, // Patient Name
            },
            string: jest.fn(() => "John Doe"),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        const result = await parseDicomFile(mockFile);

        expect(dicomParser.parseDicom).toHaveBeenCalled();
        expect(result["X00100010"].value).toBe("John Doe");
    });

     /***** UNIT TEST: Should reject on parsing errors *****/
     test("rejects if dicomParser throws an error", async () => {
        (dicomParser.parseDicom as jest.Mock).mockImplementation(() => {
            throw new Error("Parsing Error");
        });

        await expect(parseDicomFile(mockFile))
            .rejects.toEqual("Error parsing DICOM file: Error: Parsing Error");
    });

    /***** UNIT TEST: Should reject on file reading error *****/
    test("rejects if FileReader encounters an error", async () => {
        const mockFileReader = jest.spyOn(global, "FileReader").mockImplementation(() => {
            // Simulates FileReader API calls with error event
            const fileReaderInstance = {
                onerror: null as ((event: Event) => void) | null, // Ensure correct typing
                readAsArrayBuffer: jest.fn(() => {
                    if (fileReaderInstance.onerror) {
                        fileReaderInstance.onerror(new Event("error")); // Trigger error event
                    }
                }),
            };
            return fileReaderInstance as unknown as FileReader;
        });
    
        await expect(parseDicomFile(mockFile))
            .rejects.toEqual("File reading error occurred.");
    
        mockFileReader.mockRestore();
    });
    
    /***** UNIT-INTEGRATION TEST: extract hidden DICOM tags correctly *****/
    test("extracts hidden DICOM tags correctly", async () => {
        const hiddenTags = ["X0025101B", "X00431029", "X0043102A", "X7FE00010"];

        const mockDataset = {
            elements: {
                X0025101B: { vr: "UI" }, // Hidden Tag (should be hidden)
                X00431029: { vr: "UI" }, // Hidden Tag (should be hidden)
                X00100010: { vr: "PN" }, // Visible Tag (should NOT be hidden)
                X12345678: { vr: "LO" }, // Some random tag (should NOT be hidden)
            },
            string: jest.fn((tag) => (tag === "X00100010" ? "John Doe" : "Some Value")),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        const result = await parseDicomFile(mockFile); // invokes extractDicomTags

        // Check all extracted tags against the hiddenTags list
        Object.keys(mockDataset.elements).forEach((tag) => {
            if (hiddenTags.includes(tag)) {
                expect(result[tag].hidden).toBe(true);
            } else {
                expect(result[tag].hidden).toBeUndefined();
            }
        });

        // Ensure normal tags still have correct values
        expect(result["X00100010"].value).toBe("John Doe");
    });

    /***** UNIT-INTEGRATION TEST: Should extract nested sequence items correctly *****/
    test("extracts nested DICOM sequence (SQ) items", async () => {
        const mockDataset = {
            elements: {
                "0040A730": {  // Content Sequence (SQ)
                    vr: "SQ",
                    items: [{
                        dataSet: {
                            elements: {
                                "00080100": { vr: "SH", dataOffset: 0, length: 10 }, // CodeValue
                                "00080102": { vr: "SH", dataOffset: 10, length: 10 }, // CodingSchemeDesignator
                            },
                            string: jest.fn((tag) => {
                                if (tag === "00080100") return "12345";
                                if (tag === "00080102") return "LOINC";
                                return null;
                            }),
                        }
                    }]
                },
            },
            byteArray: new Uint8Array(128), // raw binary data
            string: jest.fn(() => null),
        };
        
        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        const result = await parseDicomFile(mockFile);  // invokes extractDicomTags & mocked TagDictionary

        // Ensure sequence (0040A730) extracts nested values correctly
        expect(result["0040A730"].value["00080100"].value).toBe("12345");
        expect(result["0040A730"].value["00080102"].value).toBe("LOINC");

        // Ensure sequence (0040A730) extracts nested tag names correctly
        expect(result["0040A730"].value["00080100"].tagName).toBe("Code Value");
        expect(result["0040A730"].value["00080102"].tagName).toBe("Coding Scheme Designator");

        // Ensure sequence (0040A730) extracts nested tag Id's correctly
        expect(result["0040A730"].value["00080100"].tagId).toBe("00080100");
        expect(result["0040A730"].value["00080102"].tagId).toBe("00080102");
    });

    /***** UNIT-INTEGRATION TEST: extract values from multiple DICOM tags *****/
    test("extracts values from multiple DICOM tags", async () => {
        const mockDataset = {
            elements: {
                X00100010: { vr: "PN" }, // Patient Name
                X00100020: { vr: "LO" }, // Patient ID
                X00100030: { vr: "DA" }, // Patient Birth Date
            },
            string: jest.fn((tag) => {
                if (tag === "X00100010") return "Aladin Alihodzic";
                if (tag === "X00100020") return "101010";
                if (tag === "X00100030") return "19960309";
                return "N/A";
            }),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        const result = await parseDicomFile(mockFile);

        expect(result["X00100010"].value).toBe("Aladin Alihodzic");
        expect(result["X00100020"].value).toBe("101010");
        expect(result["X00100030"].value).toBe("19960309");
    });

});