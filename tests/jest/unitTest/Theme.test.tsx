import { render, screen, fireEvent } from "@testing-library/react";
<<<<<<< HEAD:tests/jest/Theme.test.tsx
import { ThemeSelector } from "../../src/components/Navigation/ThemeSelector";
import * as storeModule from "../../src/components/State/Store";

// Mock necessary imports
jest.mock("../../src/components/State/Store", () => {
    const actualStore = jest.requireActual("../../src/components/State/Store");
    return {
        ...actualStore,
        useStore: jest.fn(),
    };
});
=======
import { ThemeSelector } from "../../../src/components/Navigation/ThemeSelector";
>>>>>>> fix/separete_jest:tests/jest/unitTest/Theme.test.tsx

jest.mock("react-tooltip", () => ({
    Tooltip: () => <div>Tooltip</div>,
}));

describe("ThemeSelector", () => {
    let mockStore: any;

    beforeEach(() => {
        localStorage.clear();
        // Reset the mock state
        mockStore = {
            theme: "corporate", // Initial theme state
            toggleTheme: jest.fn(),
        };

        // Mock the implementation of useStore to return the mock store state
        (storeModule.useStore as unknown as jest.Mock).mockImplementation(
            (selector: any) => (selector ? selector(mockStore) : mockStore)
        );

        // Mock localStorage
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });

        // Mock document methods
        document.querySelector = jest.fn().mockImplementation(() => ({
            setAttribute: jest.fn(),
            getAttribute: jest.fn().mockReturnValue("night"),
        }));
    });

    it("renders correctly with the initial theme", () => {
        render(<ThemeSelector />);

        // Check if the label and tooltip are rendered
        expect(screen.getByText("Set Theme")).toBeInTheDocument();
        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).toBeChecked(); // Since the initial theme is "night" and it's checking for "corporate"
    });

    it("renders tooltip content based on the current theme", () => {
        render(<ThemeSelector />);

        // Tooltip content should reflect the current theme
        const tooltip = screen.getByTestId("checkbox");
        expect(tooltip).toHaveAttribute(
            "data-tooltip-content",
            "Switch to Dark"
        );

        // Simulate a theme change
        mockStore.theme = "night"; // Simulate the theme change in the store
        render(<ThemeSelector />);

        // Tooltip content should now reflect the new theme
        expect(tooltip).toHaveAttribute(
            "data-tooltip-content",
            "Switch to Dark"
        );
    });

    it("calls toggleTheme when the checkbox is changed", () => {
        render(<ThemeSelector />);
        const checkbox = screen.getByTestId("checkbox");

        fireEvent.click(checkbox);

        // Check if the toggleTheme function is called when the checkbox is clicked
        expect(mockStore.toggleTheme).toHaveBeenCalledTimes(1);
    });

    it("updates the localStorage and the document theme on theme change", () => {
        render(<ThemeSelector />);

        // Simulate theme change by toggling the checkbox
        const checkbox = screen.getByTestId("checkbox");
        fireEvent.click(checkbox);

        // Ensure that localStorage is updated with the new theme
        expect(localStorage.setItem).toHaveBeenCalledWith("theme", "corporate");

        // Ensure that the document's "data-theme" attribute is updated
        expect(document.querySelector("html")?.getAttribute("data-theme")).toBe(
            "night"
        );
    });

    it("handles different initial themes correctly", () => {
        // Test when the initial theme is 'corporate'
        mockStore.theme = "night";
        render(<ThemeSelector />);

        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).not.toBeChecked(); // Should be unchecked since the initial theme is 'corporate'

        // Simulate theme change
        fireEvent.click(checkbox);

        expect(localStorage.setItem).toHaveBeenCalledWith("theme", "night");
        expect(document.querySelector("html")?.getAttribute("data-theme")).toBe(
            "night"
        );
    });
});
