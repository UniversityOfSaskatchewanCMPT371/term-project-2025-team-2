import { parseDicomFile } from "@dataFunctions/DicomData/DicomParserUtils";
import dicomParser from "dicom-parser";
import { jest } from "@jest/globals";

jest.mock("dicom-parser", () => {
    return {
        parseDicom: jest.fn(),
    };
});

jest.mock("@dataFunctions/TagDictionary/dictionary", () => ({
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

describe("DicomParserUtils Unit Tests", () => {
    let mockFile: File;

    beforeEach(() => {
        mockFile = new File([new ArrayBuffer(10)], "test.dcm", {
            type: "application/dicom",
        });
    });

    test("rejects if dicomParser throws an error", async () => {
        (dicomParser.parseDicom as jest.Mock).mockImplementation(() => {
            throw new Error("Parsing Error");
        });

        await expect(parseDicomFile(mockFile)).rejects.toEqual(
            "Error parsing DICOM file: Error: Parsing Error"
        );
    });

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
});
