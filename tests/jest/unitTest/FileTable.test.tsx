import { render, screen } from "@testing-library/react";
import { FileTable } from "../../../src/components/FileHandling/FileTable";
import * as store from "../../../src/components/State/Store";

// Mock the Zustand store
jest.mock("../../../src/components/State/Store");

describe("FileTable Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders correctly when files are present", () => {
        const mockFiles = [{ name: "file1.dcm" }, { name: "file2.dcm" }];

        // Mock the implementation of useStore
        (store.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => {
                if (selector) {
                    return selector({
                        files: mockFiles,
                        currentFileIndex: 0,
                    });
                }
                return { files: mockFiles };
            }
        );

        render(<FileTable />);

        const headerText = screen.getByText("Uploaded Files (2)");
        expect(headerText).toBeInTheDocument();
        expect(screen.getByText("file1.dcm")).toBeInTheDocument();
        expect(screen.getByText("file2.dcm")).toBeInTheDocument();
    });

    test("renders message when no files are present", () => {
        (store.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => {
                if (selector) {
                    return selector({
                        files: [],
                        currentFileIndex: 0,
                    });
                }
                return { files: [] };
            }
        );

        render(<FileTable />);

        const noFilesMessage = screen.getByText("No files uploaded yet");
        expect(noFilesMessage).toBeInTheDocument();
    });
});
