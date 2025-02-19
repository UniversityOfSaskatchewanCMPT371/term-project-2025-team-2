import { parseDicomFile } from "../../src/components/DicomData/DicomParserUtils";
import dicomParser from "dicom-parser";
import { jest } from "@jest/globals";

// Mock dicomParser
jest.mock("dicom-parser", () => ({
    parseDicom: jest.fn(),
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
                expect(result[tag].hidden).toBe(true); // Hidden tag should be marked hidden
            } else {
                expect(result[tag].hidden).toBeUndefined();
            }
        });

        // Ensure normal tags still have correct values
        expect(result["X00100010"].value).toBe("John Doe");
    });


});