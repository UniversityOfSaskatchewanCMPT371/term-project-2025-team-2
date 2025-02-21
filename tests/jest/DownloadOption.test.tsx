import { render, screen, fireEvent } from "@testing-library/react";
import DownloadOption from "../../src/components/utils/DownloadOption";

describe("DownloadOption", () => {
    const mockSetDownloadOption = jest.fn();

    beforeEach(() => {
        mockSetDownloadOption.mockClear();
    });

    it("renders with the correct download option text based on the 'downloadOption' prop", () => {
        // Test for "zip"
        render(
            <DownloadOption
                setDownloadOption={mockSetDownloadOption}
                downloadOption="zip"
            />
        );
        expect(screen.getByText("Zip")).toBeInTheDocument();

        // Test for "single"
        render(
            <DownloadOption
                setDownloadOption={mockSetDownloadOption}
                downloadOption="single"
            />
        );
        expect(screen.getByText("Single")).toBeInTheDocument();
    });

    it("calls setDownloadOption with 'zip' when checkbox is checked", () => {
        render(
            <DownloadOption
                setDownloadOption={mockSetDownloadOption}
                downloadOption="single"
            />
        );

        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        fireEvent.click(checkbox);

        expect(mockSetDownloadOption).toHaveBeenCalledWith("zip");
    });

    it("calls setDownloadOption with 'single' when checkbox is unchecked", () => {
        render(
            <DownloadOption
                setDownloadOption={mockSetDownloadOption}
                downloadOption="zip"
            />
        );

        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        fireEvent.click(checkbox);

        expect(mockSetDownloadOption).toHaveBeenCalledWith("single");
    });

    it("checkbox is checked when downloadOption is 'zip'", () => {
        render(
            <DownloadOption
                setDownloadOption={mockSetDownloadOption}
                downloadOption="zip"
            />
        );
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    it("checkbox is unchecked when downloadOption is 'single'", () => {
        render(
            <DownloadOption
                setDownloadOption={mockSetDownloadOption}
                downloadOption="single"
            />
        );
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
    });
});
