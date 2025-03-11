import { render, screen, fireEvent } from "@testing-library/react";
import { TableControls } from "../../../../src/components/DicomData/TableComponents/TableControls";
import "@testing-library/jest-dom";

describe("TableControls", () => {
    test("renders the component with initial props", () => {
        render(
            <TableControls
                searchTerm=""
                onSearchChange={jest.fn()}
                onSave={jest.fn()}
            />
        );
        expect(screen.getByText("Download File")).toBeInTheDocument();
        expect(screen.getByText("Auto Anon")).toBeInTheDocument();
    });

    test("calls onSearchChange when search term is changed", () => {
        const onSearchChange = jest.fn();
        render(
            <TableControls
                searchTerm=""
                onSearchChange={onSearchChange}
                onSave={jest.fn()}
            />
        );
        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, { target: { value: "test" } });
        expect(onSearchChange).toHaveBeenCalledWith("test");
    });

    test("calls onSave when Download File button is clicked", () => {
        const onSave = jest.fn();
        render(
            <TableControls
                searchTerm=""
                onSearchChange={jest.fn()}
                onSave={onSave}
            />
        );
        fireEvent.click(screen.getByText("Download File"));
        expect(onSave).toHaveBeenCalledTimes(1);
    });

    test("renders the search input with the correct value", () => {
        render(
            <TableControls
                searchTerm="test search"
                onSearchChange={jest.fn()}
                onSave={jest.fn()}
            />
        );
        const searchInput = screen.getByRole("textbox");
        expect(searchInput).toHaveValue("test search");
    });

    test("calls onSearchChange with an empty string when search input is cleared", () => {
        const onSearchChange = jest.fn();
        render(
            <TableControls
                searchTerm="initial value"
                onSearchChange={onSearchChange}
                onSave={jest.fn()}
            />
        );
        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, { target: { value: "" } });
        expect(onSearchChange).toHaveBeenCalledWith("");
    });
});
