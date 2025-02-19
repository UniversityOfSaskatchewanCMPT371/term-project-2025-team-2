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
    
    /***** UNIT-INTEGRATION TEST: extract hidden DICOM tags *****/
    test("extracts hidden DICOM tags correctly", async () => {
        const mockDataset = {
            elements: {
                X0025101B: { vr: "UI" }, // Hidden Tag
                X00100010: { vr: "PN" }, // Not a hidden Tag
            },
            string: jest.fn((tag) => (tag === "X00100010" ? "John Doe" : "Hidden Value")),
        };

        (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataset);

        const result = await parseDicomFile(mockFile);

        expect(result["X0025101B"].hidden).toBe(true);
        expect(result["X00100010"].value).toBe("John Doe");
    });

});