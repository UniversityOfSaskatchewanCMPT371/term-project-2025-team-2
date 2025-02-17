import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FileUploader from "../../src/components/FileHandling/FileUploader";
import { jest } from "@jest/globals";

// Mock the `parseDicomFile` function
jest.mock("../../src/components/DicomData/DicomParserUtils", () => ({
    parseDicomFile: jest.fn(),
}));

describe("FileUploader Component Tests", () => {
    let mockOnFileUpload: jest.Mock;

    beforeEach(() => {
        mockOnFileUpload = jest.fn();
    });

    //***** UNIT TEST: correctly render UI elements *****/
    test("renders FileUploader correctly", () => {
        render(<FileUploader onFileUpload={mockOnFileUpload} />);
        
        expect(
            screen.getByText("Drag and drop DICOM files here, or click the button below to select files")
        ).toBeInTheDocument();

        expect(screen.getByRole("button", { name: /select files/i })).toBeInTheDocument();
    });

});