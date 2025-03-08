import { render, screen, fireEvent } from "@testing-library/react";
import { FileTableBody } from "../../../src/components/FileHandling/FileTableBody";
import * as store from "../../../src/components/State/Store";

// Mock the Zustand store
jest.mock("../../../src/components/State/Store");

describe("FileTableBody Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders correctly with files", () => {
        const mockFiles = [{ name: "file1.dcm" }, { name: "file2.dcm" }];
        (store.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => {
                if (selector) {
                    return selector({
                        files: mockFiles,
                        currentFileIndex: 0,
                        series: false,
                        setCurrentFileIndex: jest.fn(),
                    });
                }
                return { files: mockFiles };
            }
        );

        render(<FileTableBody openModal={jest.fn()} />);

        expect(screen.getByText("file1.dcm")).toBeInTheDocument();
        expect(screen.getByText("file2.dcm")).toBeInTheDocument();
    });

    test("calls setCurrentFileIndex when a file is clicked", () => {
        const mockFiles = [{ name: "file1.dcm" }, { name: "file2.dcm" }];
        const setCurrentFileIndexMock = jest.fn();
        (store.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => {
                if (selector) {
                    return selector({
                        files: mockFiles,
                        currentFileIndex: 0,
                        series: false,
                        setCurrentFileIndex: setCurrentFileIndexMock,
                    });
                }
                return { files: mockFiles };
            }
        );

        render(<FileTableBody openModal={jest.fn()} />);

        const firstRow = screen.getByText("file1.dcm").closest("tr");
        fireEvent.click(firstRow!);

        expect(setCurrentFileIndexMock).toHaveBeenCalledWith(0);
    });

    test("opens modal when series is true", () => {
        const mockFiles = [{ name: "file1.dcm" }];
        const openModalMock = jest.fn();
        (store.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => {
                if (selector) {
                    return selector({
                        files: mockFiles,
                        currentFileIndex: 0,
                        series: true,
                        setCurrentFileIndex: jest.fn(),
                    });
                }
                return { files: mockFiles };
            }
        );

        render(<FileTableBody openModal={openModalMock} />);

        const firstRow = screen.getByText("file1.dcm").closest("tr");
        fireEvent.click(firstRow!);

        expect(openModalMock).toHaveBeenCalledWith(true);
    });
});
