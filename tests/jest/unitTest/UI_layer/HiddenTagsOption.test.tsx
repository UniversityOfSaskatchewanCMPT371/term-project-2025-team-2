import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HiddenTagsOption } from "../../../../src/Components/Navigation/HiddenTagsOption";

describe("HiddenTagsOption", () => {
    const mockSetShowHiddenTags = jest.fn();

    beforeEach(() => {
        mockSetShowHiddenTags.mockClear();
    });

    it("renders with showHiddenTags set to false", () => {
        render(
            <HiddenTagsOption
                showHiddenTags={false}
                setShowHiddenTags={mockSetShowHiddenTags}
            />
        );

        expect(screen.getByText("Show Hidden Tags")).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("renders with showHiddenTags set to true", () => {
        render(
            <HiddenTagsOption
                showHiddenTags={true}
                setShowHiddenTags={mockSetShowHiddenTags}
            />
        );

        expect(screen.getByText("Show Hidden Tags")).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("calls setShowHiddenTags with true when checkbox is checked", () => {
        render(
            <HiddenTagsOption
                showHiddenTags={false}
                setShowHiddenTags={mockSetShowHiddenTags}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(mockSetShowHiddenTags).toHaveBeenCalledWith(true);
    });

    it("calls setShowHiddenTags with false when checkbox is unchecked", () => {
        render(
            <HiddenTagsOption
                showHiddenTags={true}
                setShowHiddenTags={mockSetShowHiddenTags}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(mockSetShowHiddenTags).toHaveBeenCalledWith(false);
    });

    it("displays correct tooltip content based on showHiddenTags state", () => {
        const { rerender } = render(
            <HiddenTagsOption
                showHiddenTags={false}
                setShowHiddenTags={mockSetShowHiddenTags}
            />
        );
        expect(screen.getByRole("checkbox")).toHaveAttribute(
            "data-tooltip-content",
            "Show Hidden Tags"
        );

        rerender(
            <HiddenTagsOption
                showHiddenTags={true}
                setShowHiddenTags={mockSetShowHiddenTags}
            />
        );
        expect(screen.getByRole("checkbox")).toHaveAttribute(
            "data-tooltip-content",
            "Hide Hidden Tags"
        );
    });
});
