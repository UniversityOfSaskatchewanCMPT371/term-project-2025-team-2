import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { FileUploader } from "@components/FileHandling/FileUploader";

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
                "Drag and drop DICOM files here, or click the button below to select files"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /select files/i })
        ).toBeInTheDocument();
    });
});
