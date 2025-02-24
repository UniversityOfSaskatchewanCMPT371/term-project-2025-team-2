import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import FileUploader from "../../src/components/FileHandling/FileUploader";
import FileTable from "../../src/components/FileHandling/FileTable";
import FileHeader from "../../src/components/FileHandling/FileHeader";
import FileTableBody from "../../src/components/FileHandling/FileTableBody";

describe("File Handling Integration Tests", () => {
    const mockOnFileUpload = jest.fn();
    const mockOnFileSelect = jest.fn();
    const mockClearData = jest.fn();
    const mockToggleModal = jest.fn();

    const mockFiles = [
        new File(["dummy content"], "test1.dcm"),
        new File(["dummy content"], "test2.dcm"),
    ];

    test("uploads files via FileUploader", async () => {
        await act(async () => {
            render(
                <FileUploader
                    onFileUpload={mockOnFileUpload}
                    loading={jest.fn()}
                    clearData={mockClearData}
                    toggleModal={mockToggleModal}
                />
            );
        });

        // Find the hidden file input element directly by its type 'file'
        const fileInput = screen.getByRole("button", { name: /select files/i });
        expect(fileInput).toBeInTheDocument();

        // Simulate clicking the "Select Files" button to open the file input
        await act(async () => {
            fireEvent.click(fileInput);
        });

        // Now, find the file input element and trigger the file change event
        const hiddenFileInput = screen
            .getByRole("presentation")
            .querySelector('input[type="file"]');
        expect(hiddenFileInput).not.toBeNull();

        await act(async () => {
            fireEvent.change(hiddenFileInput as HTMLInputElement, {
                target: { files: mockFiles },
            });
        });

        await waitFor(() => {
            expect(mockOnFileUpload).toHaveBeenCalled();
        });
    });

    test("displays uploaded files in FileTable", async () => {
        await act(async () => {
            render(
                <FileTable
                    files={mockFiles}
                    currentFileIndex={0}
                    onFileSelect={mockOnFileSelect}
                    series={false}
                />
            );
        });

        expect(screen.getByText("Uploaded Files (2)")).toBeInTheDocument();
        expect(screen.getByText("test1.dcm")).toBeInTheDocument();
        expect(screen.getByText("test2.dcm")).toBeInTheDocument();
    });

    test("displays correct file name in FileHeader", async () => {
        await act(async () => {
            render(<FileHeader files={mockFiles} currentFileIndex={1} />);
        });

        expect(
            screen.getByText("Currently Viewing: test2.dcm")
        ).toBeInTheDocument();
    });

    test("triggers modal when selecting file in series mode", async () => {
        await act(async () => {
            render(
                <table>
                    <FileTableBody
                        files={mockFiles}
                        currentFileIndex={0}
                        onFileSelect={mockOnFileSelect}
                        series={true}
                        openModal={mockToggleModal}
                    />
                </table>
            );
        });

        await act(async () => {
            fireEvent.click(screen.getByText("test2.dcm"));
        });

        await waitFor(() => {
            expect(mockToggleModal).toHaveBeenCalledWith(true);
        });
    });
});
