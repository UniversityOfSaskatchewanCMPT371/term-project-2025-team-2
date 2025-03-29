import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FileUploader from "@features/FileHandling/Components/FileUploader";

describe("FileUploader Component Unit Tests", () => {
    const mockToggleModal = jest.fn();

    test("renders FileUploader correctly", () => {
        render(
            <FileUploader
                onFileUpload={() => {}}
                loading={() => {}}
                clearData={() => {}}
                toggleModal={mockToggleModal}
            />
        );

        expect(
            screen.getByText(
                "Drag and drop DICOM files or folders here, or click the buttons below to select"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /select files/i })
        ).toBeInTheDocument();
    });
    test("renders FileUploader correctly", () => {
        render(
            <FileUploader
                onFileUpload={() => {}}
                loading={() => {}}
                clearData={() => {}}
                toggleModal={mockToggleModal}
            />
        );

        expect(
            screen.getByText(
                "Drag and drop DICOM files or folders here, or click the buttons below to select"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /select files/i })
        ).toBeInTheDocument();
    });
    test("clicking 'Select Files' does not crash component", () => {
        render(
            <FileUploader
                onFileUpload={() => {}}
                loading={() => {}}
                clearData={() => {}}
                toggleModal={mockToggleModal}
            />
        );

        const selectFilesButton = screen.getByRole("button", {
            name: /select files/i,
        });
        selectFilesButton.click(); // This won't crash or throw

        expect(selectFilesButton).toBeInTheDocument();
    });
    test("clicking 'Select Folder' does not crash component", () => {
        render(
            <FileUploader
                onFileUpload={() => {}}
                loading={() => {}}
                clearData={() => {}}
                toggleModal={mockToggleModal}
            />
        );

        const selectFolderButton = screen.getByRole("button", {
            name: /select folder/i,
        });
        selectFolderButton.click(); // Simulate folder open intent

        expect(selectFolderButton).toBeInTheDocument();
    });
});
