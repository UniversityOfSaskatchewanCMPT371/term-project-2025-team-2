import { render, screen } from "@testing-library/react";
import EmptyTableRow from "../../../../src/components/DicomData/TableComponents/EmptyTableRow";

describe("EmptyTableRow Component", () => {
    test("renders correctly with the appropriate message", () => {
        render(
            <table>
                <tbody>
                    <EmptyTableRow />
                </tbody>
            </table>
        );

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

        const tableRow = container.querySelector("tr");
        expect(tableRow).toBeInTheDocument();

        const cells = tableRow ? tableRow.querySelectorAll("td") : [];
        expect(cells).toHaveLength(1); 
        if (cells.length > 0) {
            expect(cells[0]).toHaveAttribute("colspan", "3");
        }
    });
});
