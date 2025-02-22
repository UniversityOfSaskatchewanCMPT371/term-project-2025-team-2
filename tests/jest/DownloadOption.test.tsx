import { render, screen, fireEvent } from "@testing-library/react";
import DownloadOption from "../../src/components/utils/DownloadOption";

jest.mock("react-tooltip", () => ({
    Tooltip: () => <div>Mocked Tooltip</div>,
}));

describe("DownloadOption Component", () => {
    const mockSetDownloadOption = jest.fn();

    beforeEach(() => {
        mockSetDownloadOption.mockClear();
    });

    test("renders with 'zip' download option", () => {
        render(
            <DownloadOption setDownloadOption={mockSetDownloadOption} downloadOption="zip" />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeChecked();

        expect(screen.getByText("Zip File")).toBeInTheDocument();

        expect(checkbox).toHaveAttribute("data-tooltip-content", "Switch to Individual Files");
    });

    test("renders with 'individual files' download option", () => {
        render(
            <DownloadOption setDownloadOption={mockSetDownloadOption} downloadOption="single" />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).not.toBeChecked();

        expect(screen.getByText("Individual Files")).toBeInTheDocument();

        expect(checkbox).toHaveAttribute("data-tooltip-content", "Switch to Zip File");
    });

    test("checkbox click changes the download option", () => {
        render(
            <DownloadOption setDownloadOption={mockSetDownloadOption} downloadOption="single" />
        );

        const checkbox = screen.getByRole("checkbox");

        fireEvent.click(checkbox);
        expect(mockSetDownloadOption).toHaveBeenCalledWith("zip");
    });
});
