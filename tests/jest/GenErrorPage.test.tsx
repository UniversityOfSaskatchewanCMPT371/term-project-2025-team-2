import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import GenErrorPage from "../../src/components/ErrorHandling/GenErrorPage";

// GenErrorPage Tests
describe("GenErrorPage Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        delete (window as any).location;
        window.location = { reload: jest.fn() } as any;
    });

    test("displays error message correctly", () => {
        const error = new Error("Test error message");
        render(<GenErrorPage error={error} />);

        expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
        expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    test("reloads page when 'Reload' button is clicked", async () => {
        const error = new Error("Test error message");
        render(<GenErrorPage error={error} />);

        const reloadButton = screen.getByRole("button", { name: "Reload" });
        await userEvent.click(reloadButton);

        expect(window.location.reload).toHaveBeenCalled();
    });
});
