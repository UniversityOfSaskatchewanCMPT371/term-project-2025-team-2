import { render, screen, fireEvent } from "@testing-library/react";
import DownloadOption from "../../../../src/components/utils/DownloadOption";
import * as storeModule from "../../../../src/components/State/Store";

jest.mock("react-tooltip", () => ({
    Tooltip: () => <div>Mocked Tooltip</div>,
}));

jest.mock("../../../../src/components/State/Store", () => {
    const actual = jest.requireActual("../../../../src/components/State/Store");
    return {
        ...actual,
        useStore: jest.fn(),
    };
});

describe("DownloadOption Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders with 'zip' download option", () => {
        (
            storeModule.useStore as unknown as jest.Mock<any, any>
        ).mockImplementation((selector) => {
            if (selector) {
                return selector({
                    downloadOption: "zip",
                    setDownloadOption: jest.fn(),
                    files: [{ name: "test1.dcm" }, { name: "test2.dcm" }],
                });
            }
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
        const mockSetDownloadOption = jest.fn();

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

        fireEvent.click(checkbox);

        expect(mockSetDownloadOption).toHaveBeenCalledWith("zip");
    });

    test("checkbox click changes from zip to single", () => {
        const mockSetDownloadOption = jest.fn();

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

        fireEvent.click(checkbox);

        expect(mockSetDownloadOption).toHaveBeenCalledWith("single");
    });
});
