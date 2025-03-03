import { render, screen } from "@testing-library/react";
import EmptyTableRow from "../../../src/components/DicomData/TableComponents/EmptyTableRow";

describe("EmptyTableRow Component", () => {
    test("renders correctly with the appropriate message", () => {
        render(
            <table>
                <tbody>
                    <EmptyTableRow />
                </tbody>
            </table>
        );

        // Check if the message is displayed
        const message = screen.getByText("No matching tags found");
        expect(message).toBeInTheDocument();
    });

    test("has the correct table structure", () => {
        const { container } = render(
            <table>
                <tbody>
                    <EmptyTableRow />
                </tbody>
            </table>
        );

        // Check if the rendered element is a table row
        const tableRow = container.querySelector("tr");
        expect(tableRow).toBeInTheDocument();

        // Check if the row has the correct number of columns
        const cells = tableRow ? tableRow.querySelectorAll("td") : [];
        expect(cells).toHaveLength(1); // Since colSpan is set to 3, it should be one cell
        if (cells.length > 0) {
            expect(cells[0]).toHaveAttribute("colspan", "3");
        }
    });
});