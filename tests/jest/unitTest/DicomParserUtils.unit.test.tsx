// tests/jest/unitTest/DicomParserUtils.unit.test.tsx
import { parseDicomFile } from "../../../src/components/DicomData/DicomParserUtils";
import dicomParser from "dicom-parser";
import { jest } from "@jest/globals";

// Mock dicomParser
jest.mock("dicom-parser", () => ({
    parseDicom: jest.fn(),
}));

// Mock TagDictionary
jest.mock("../../../src/tagDictionary/dictionary", () => ({
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
                    "00100010": "PN", // Patient Name VR
                    "00100020": "LO", // Patient ID VR
                    "00100030": "DA", // Patient Birth Date VR
                }[tag] || "Unknown"
            ); // Default to Unknown VR if not found
        }
    },
}));

describe("DicomParserUtils Unit Tests", () => {
    let mockFile: File;

    beforeEach(() => {
        // Create a mock DICOM file
        mockFile = new File([new ArrayBuffer(10)], "test.dcm", {
            type: "application/dicom",
        });
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

        await expect(parseDicomFile(mockFile)).rejects.toEqual(
            "File reading error occurred."
        );

        mockFileReader.mockRestore();
    });
});