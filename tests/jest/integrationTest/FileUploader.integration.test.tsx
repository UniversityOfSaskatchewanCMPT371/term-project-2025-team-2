import "@testing-library/jest-dom";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import { jest } from "@jest/globals";
import { parseDicomFile } from "../../../src/components/DicomData/DicomParserUtils";
import { FileUploader } from "../../../src/components/FileHandling/FileUploader";

jest.mock("../../../src/components/DicomData/DicomParserUtils", () => ({
    parseDicomFile: jest.fn(() =>
        Promise.resolve({ mockMetadata: "mocked DICOM data" })
    ),
}));

describe("FileUploader Component Integration Tests", () => {
    const mockToggleModal = jest.fn();
    const mockOnFileUpload = jest.fn();
    let mockedParseDicomFile: jest.MockedFunction<typeof parseDicomFile>;

    beforeEach(() => {
        mockedParseDicomFile = parseDicomFile as jest.MockedFunction<
            typeof parseDicomFile
        >;
    });

    test("calls onFileUpload when files are selected", async () => {
        render(
            <FileUploader
                onFileUpload={mockOnFileUpload}
                loading={() => {}}
                clearData={() => {}}
                toggleModal={mockToggleModal}
            />
        );

        const input = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        expect(input).not.toBeNull(); 

        const file = new File(["mockDICOM"], "file1.dcm", {
            type: "application/dicom",
        });
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => expect(mockOnFileUpload).toHaveBeenCalled());
    });

    test("calls onFileUpload when a file is dropped", async () => {
        render(
            <FileUploader
                onFileUpload={mockOnFileUpload}
                loading={() => {}}
                clearData={() => {}}
                toggleModal={mockToggleModal}
            />
        );

        const dropZone = screen.getByText(/drag and drop/i);
        const file = new File(["mockDICOM"], "file1.dcm", {
            type: "application/dicom",
        });

        const dropEvent = new Event("drop", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(dropEvent, "dataTransfer", {
            value: {
                files: [file],
                types: ["Files"],
                items: [
                    { kind: "file", type: file.type, getAsFile: () => file },
                ],
            },
        });

        act(() => {
            dropZone.dispatchEvent(dropEvent);
        });

        await waitFor(() => expect(mockOnFileUpload).toHaveBeenCalled());
    });

    test("processes DICOM files and calls onFileUpload with parsed metadata", async () => {
        const dicomMetadata = {
            Tag: "(0002,0000)",
            TagDescription: "File Meta Information Group Length",
            Value: "198",
        };

        mockedParseDicomFile.mockResolvedValue(dicomMetadata);

        render(
            <FileUploader
                onFileUpload={mockOnFileUpload}
                loading={() => {}}
                clearData={() => {}}
                toggleModal={mockToggleModal}
            />
        );

        const file = new File(["DICOM"], "file1.dcm", {
            type: "application/dicom",
        });
        const input = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        expect(input).not.toBeNull(); 

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => expect(parseDicomFile).toHaveBeenCalledWith(file));

        await waitFor(() =>
            expect(mockOnFileUpload).toHaveBeenCalledWith(
                [file],
                [dicomMetadata]
            )
        );
    });
});
