import { render, screen, fireEvent } from "@testing-library/react";
import { EditOption } from "../../../../src/Components/utils/EditOption";
import { useStore } from "@state/Store";
import "@testing-library/jest-dom";

// Mock useStore
jest.mock("@state/Store", () => ({
    useStore: jest.fn(),
}));

// Mock logger
jest.mock("@logger/Logger", () => ({
    debug: jest.fn(),
    info: jest.fn(),
}));

describe("EditOption Component", () => {
    const mockSetAllowEditLockedTags = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("calls setAllowEditLockedTags(true) when toggled on", () => {
        (useStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                allowEditLockedTags: false,
                setAllowEditLockedTags: mockSetAllowEditLockedTags,
            })
        );

        render(<EditOption />);

        const checkbox = screen.getByRole("checkbox", {
            name: /allow edit locked tags/i,
        });
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);

        expect(mockSetAllowEditLockedTags).toHaveBeenCalledWith(true);
    });

    it("calls setAllowEditLockedTags(false) when toggled off", () => {
        (useStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                allowEditLockedTags: true,
                setAllowEditLockedTags: mockSetAllowEditLockedTags,
            })
        );

        render(<EditOption />);

        const checkbox = screen.getByRole("checkbox", {
            name: /allow edit locked tags/i,
        });
        expect(checkbox).toBeChecked();

        fireEvent.click(checkbox);

        expect(mockSetAllowEditLockedTags).toHaveBeenCalledWith(false);
    });

    it("renders with tooltip attributes correctly", () => {
        (useStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                allowEditLockedTags: false,
                setAllowEditLockedTags: mockSetAllowEditLockedTags,
            })
        );

        render(<EditOption />);
        const checkbox = screen.getByRole("checkbox", {
            name: /allow edit locked tags/i,
        });

        expect(checkbox).toHaveAttribute(
            "data-tooltip-id",
            "edit-option-button-tooltip"
        );
        expect(checkbox).toHaveAttribute(
            "data-tooltip-content",
            "Dangerous - Edit Locked Tags"
        );
    });
});
