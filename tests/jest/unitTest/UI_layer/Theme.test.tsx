import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSelector } from "@components/Navigation/ThemeSelector";
import * as storeModule from "@components/State/Store";

jest.mock("@components/State/Store", () => {
    const actualStore = jest.requireActual("@components/State/Store");
    return {
        ...actualStore,
        useStore: jest.fn(),
    };
});

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

        (storeModule.useStore as unknown as jest.Mock).mockImplementation(
            (selector: any) => (selector ? selector(mockStore) : mockStore)
        );

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });

        document.querySelector = jest.fn().mockImplementation(() => ({
            setAttribute: jest.fn(),
            getAttribute: jest.fn().mockReturnValue("night"),
        }));
    });

    it("renders correctly with the initial theme", () => {
        render(<ThemeSelector />);

        expect(screen.getByText("Set Theme")).toBeInTheDocument();
        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).toBeChecked();
    });

    it("renders tooltip content based on the current theme", () => {
        render(<ThemeSelector />);

        const tooltip = screen.getByTestId("checkbox");
        expect(tooltip).toHaveAttribute(
            "data-tooltip-content",
            "Switch to Dark"
        );

        mockStore.theme = "night";
        render(<ThemeSelector />);

        expect(tooltip).toHaveAttribute(
            "data-tooltip-content",
            "Switch to Dark"
        );
    });

    it("calls toggleTheme when the checkbox is changed", () => {
        render(<ThemeSelector />);
        const checkbox = screen.getByTestId("checkbox");

        fireEvent.click(checkbox);

        expect(mockStore.toggleTheme).toHaveBeenCalledTimes(1);
    });

    it("updates the localStorage and the document theme on theme change", () => {
        render(<ThemeSelector />);

        const checkbox = screen.getByTestId("checkbox");
        fireEvent.click(checkbox);

        expect(localStorage.setItem).toHaveBeenCalledWith("theme", "corporate");

        expect(document.querySelector("html")?.getAttribute("data-theme")).toBe(
            "night"
        );
    });

    it("handles different initial themes correctly", () => {
        mockStore.theme = "night";
        render(<ThemeSelector />);

        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);

        expect(localStorage.setItem).toHaveBeenCalledWith("theme", "night");
        expect(document.querySelector("html")?.getAttribute("data-theme")).toBe(
            "night"
        );
    });
});
