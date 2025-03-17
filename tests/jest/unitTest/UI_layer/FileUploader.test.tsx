import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { FileUploader } from "@features/FileHandling/Components/FileUploader";

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
});
