import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSelector } from "../../src/components/Navigation/ThemeSelector";

jest.mock("react-tooltip", () => ({
    Tooltip: () => <div>Tooltip</div>,
}));

describe("ThemeSelector", () => {
    const mockToggleTheme = jest.fn();

    beforeEach(() => {
        mockToggleTheme.mockClear();
    });

    it("renders the correct icon based on the current theme", () => {
        render(
            <ThemeSelector toggleTheme={mockToggleTheme} currTheme="night" />
        );

        expect(screen.getByLabelText(/sun/i)).toBeInTheDocument();

        render(<ThemeSelector toggleTheme={mockToggleTheme} currTheme="day" />);

        expect(screen.getByLabelText(/moon/i)).toBeInTheDocument();
    });

    it("renders a Tooltip component", () => {
        render(
            <ThemeSelector toggleTheme={mockToggleTheme} currTheme="night" />
        );

        expect(screen.getByText("Tooltip")).toBeInTheDocument();
    });

    it("calls toggleTheme when the checkbox is clicked", () => {
        render(
            <ThemeSelector toggleTheme={mockToggleTheme} currTheme="night" />
        );
        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
});
