import { render, screen, fireEvent } from "@testing-library/react";
import DownloadOption from "../../../src/components/utils/DownloadOption";
import * as storeModule from "../../../src/components/State/Store";

// Mock react-tooltip
jest.mock("react-tooltip", () => ({
    Tooltip: () => <div>Mocked Tooltip</div>,
}));

// Mock the Zustand store
jest.mock("../../../src/components/State/Store", () => {
    const actual = jest.requireActual("../../../src/components/State/Store");
    return {
        ...actual,
        useStore: jest.fn(),
    };
});

describe("DownloadOption Component", () => {
    // Setup before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders with 'zip' download option", () => {
        // Mock the store to return 'zip' as the current downloadOption
        (
            storeModule.useStore as unknown as jest.Mock<any, any>
        ).mockImplementation((selector) => {
            if (selector) {
                // For selectors, simulate accessing state properties
                return selector({
                    downloadOption: "zip",
                    setDownloadOption: jest.fn(),
                    files: [{ name: "test1.dcm" }, { name: "test2.dcm" }],
                });
            }
            // Return the full mock state when no selector is provided
            return {
                downloadOption: "zip",
                setDownloadOption: jest.fn(),
                files: [{ name: "test1.dcm" }, { name: "test2.dcm" }],
            };
        });

        render(<DownloadOption />);

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeChecked();
        expect(screen.getByText("Zip File")).toBeInTheDocument();
        expect(checkbox).toHaveAttribute(
            "data-tooltip-content",
            "Switch to Individual Files"
        );
    });

    test("renders with 'single' download option", () => {
        // Mock the store to return 'single' as the current downloadOption
        (storeModule.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => {
                if (selector) {
                    return selector({
                        downloadOption: "single",
                        setDownloadOption: jest.fn(),
                        files: [{ name: "test1.dcm" }, { name: "test2.dcm" }],
                    });
                }
                return {
                    downloadOption: "single",
                    setDownloadOption: jest.fn(),
                    files: [{ name: "test1.dcm" }, { name: "test2.dcm" }],
                };
            }
        );

        render(<DownloadOption />);

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).not.toBeChecked();
        expect(screen.getByText("Individual Files")).toBeInTheDocument();
        expect(checkbox).toHaveAttribute(
            "data-tooltip-content",
            "Switch to Zip File"
        );
    });

    test("checkbox click changes the download option", () => {
        // Create a mock for setDownloadOption
        const mockSetDownloadOption = jest.fn();

        // Mock the store with the current option as 'single' and our mock setter
        (storeModule.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => {
                if (selector) {
                    return selector({
                        downloadOption: "single",
                        setDownloadOption: mockSetDownloadOption,
                        files: [{ name: "test1.dcm" }, { name: "test2.dcm" }],
                    });
                }
                return {
                    downloadOption: "single",
                    setDownloadOption: mockSetDownloadOption,
                    files: [{ name: "test1.dcm" }, { name: "test2.dcm" }],
                };
            }
        );

        render(<DownloadOption />);

        const checkbox = screen.getByRole("checkbox");

        // Click to change from "single" to "zip"
        fireEvent.click(checkbox);

        // Verify the setter was called with the new value
        expect(mockSetDownloadOption).toHaveBeenCalledWith("zip");
    });

    test("checkbox click changes from zip to single", () => {
        // Create a mock for setDownloadOption
        const mockSetDownloadOption = jest.fn();

        // Mock the store with the current option as 'zip' and our mock setter
        (storeModule.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => {
                if (selector) {
                    return selector({
                        downloadOption: "zip",
                        setDownloadOption: mockSetDownloadOption,
                        files: [{ name: "test1.dcm" }, { name: "test2.dcm" }],
                    });
                }
                return {
                    downloadOption: "zip",
                    setDownloadOption: mockSetDownloadOption,
                    files: [{ name: "test1.dcm" }, { name: "test2.dcm" }],
                };
            }
        );

        render(<DownloadOption />);

        const checkbox = screen.getByRole("checkbox");

        // Click to change from "zip" to "single"
        fireEvent.click(checkbox);

        // Verify the setter was called with the new value
        expect(mockSetDownloadOption).toHaveBeenCalledWith("single");
    });
});
