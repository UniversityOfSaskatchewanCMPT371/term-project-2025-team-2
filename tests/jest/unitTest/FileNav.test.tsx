import { render, screen, fireEvent } from "@testing-library/react";
import { FileNavigation } from "../../../src/components/Navigation/FileNavigation";

describe("FileNavigation", () => {
    const mockOnPrevFile = jest.fn();
    const mockOnNextFile = jest.fn();

    beforeEach(() => {
        mockOnPrevFile.mockClear();
        mockOnNextFile.mockClear();
    });

    it("renders Previous and Next buttons", () => {
        render(
            <FileNavigation
                currentFileIndex={1}
                fileCount={5}
                onPrevFile={mockOnPrevFile}
                onNextFile={mockOnNextFile}
            />
        );

        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("disables Previous button when currentFileIndex is 0", () => {
        render(
            <FileNavigation
                currentFileIndex={0}
                fileCount={5}
                onPrevFile={mockOnPrevFile}
                onNextFile={mockOnNextFile}
            />
        );

        const prevButton = screen.getByText("Previous");
        expect(prevButton).toBeDisabled();
    });

    it("disables Next button when currentFileIndex is the last index", () => {
        render(
            <FileNavigation
                currentFileIndex={4}
                fileCount={5}
                onPrevFile={mockOnPrevFile}
                onNextFile={mockOnNextFile}
            />
        );

        const nextButton = screen.getByText("Next");
        expect(nextButton).toBeDisabled();
    });

    it("enables Previous button when currentFileIndex is not 0", () => {
        render(
            <FileNavigation
                currentFileIndex={2}
                fileCount={5}
                onPrevFile={mockOnPrevFile}
                onNextFile={mockOnNextFile}
            />
        );

        const prevButton = screen.getByText("Previous");
        expect(prevButton).toBeEnabled();
    });

    it("enables Next button when currentFileIndex is not the last index", () => {
        render(
            <FileNavigation
                currentFileIndex={2}
                fileCount={5}
                onPrevFile={mockOnPrevFile}
                onNextFile={mockOnNextFile}
            />
        );

        const nextButton = screen.getByText("Next");
        expect(nextButton).toBeEnabled();
    });

    it("calls onPrevFile when Previous button is clicked", () => {
        render(
            <FileNavigation
                currentFileIndex={2}
                fileCount={5}
                onPrevFile={mockOnPrevFile}
                onNextFile={mockOnNextFile}
            />
        );

        const prevButton = screen.getByText("Previous");
        fireEvent.click(prevButton);
        expect(mockOnPrevFile).toHaveBeenCalledTimes(1);
    });

    it("calls onNextFile when Next button is clicked", () => {
        render(
            <FileNavigation
                currentFileIndex={2}
                fileCount={5}
                onPrevFile={mockOnPrevFile}
                onNextFile={mockOnNextFile}
            />
        );

        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);
        expect(mockOnNextFile).toHaveBeenCalledTimes(1);
    });
});
