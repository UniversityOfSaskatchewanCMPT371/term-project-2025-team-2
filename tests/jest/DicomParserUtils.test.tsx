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

});