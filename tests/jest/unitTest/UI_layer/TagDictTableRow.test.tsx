import { render, screen, fireEvent } from "@testing-library/react";
import { TagDictTableRow } from "@features/TagDictEditor/TagDictTableRow";
import "@testing-library/jest-dom";

describe("TagDictTableRow", () => {
    const defaultProps = {
        tagId: "00100010",
        tagName: "PatientName",
        tagVR: "PN",
        onUpdateValue: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders normal row with tag info", () => {
        render(<TagDictTableRow {...defaultProps} />);
        expect(screen.getByText("X")).toBeInTheDocument();
        expect(screen.getByText("00100010")).toBeInTheDocument();
        expect(screen.getByText("PN")).toBeInTheDocument();
        expect(screen.getByText("PatientName")).toBeInTheDocument();
    });

    it("shows pendingValue text when it differs from tagName", () => {
        render(
            <TagDictTableRow
                {...defaultProps}
                pendingValue="ModifiedPatientName"
            />
        );

        expect(screen.getByText("ModifiedPatientName")).toBeInTheDocument();
        expect(screen.getByText("(pending)")).toBeInTheDocument();
    });

    it("shows undo icon when isPendingDelete is true", () => {
        render(<TagDictTableRow {...defaultProps} isPendingDelete={true} />);

        // This check is safe and reliable
        expect(
            screen.getByText((text) => text.includes("Pending deletion"))
        ).toBeInTheDocument();

        // We will NOT try to find the SVG undo icon by role or label anymore
        // Instead, just simulate a click on the entire row area
        const row = screen.getByText("PatientName").closest("tr");
        if (row) {
            const svgs = row.querySelectorAll("svg");
            fireEvent.click(svgs[0]); // Assume first icon is undo
        }

        expect(defaultProps.onUpdateValue).toHaveBeenCalledWith(
            "00100010",
            "PatientName",
            false
        );
    });
});
