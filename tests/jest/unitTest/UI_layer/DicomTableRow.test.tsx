import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import { DicomTableRow } from "../../../../src/Features/DicomTagTable/Components/DicomTableRow";

const mockOnUpdateValue = jest.fn();

const mockRow = {
    tagId: "1",
    tagName: "Tag Name 1",
    value: "Value 1",
};

const setup = (props = {}) => {
    render(
        <table>
            <tbody>
                <DicomTableRow
                    row={mockRow}
                    index={0}
                    onUpdateValue={mockOnUpdateValue}
                    {...props}
                />
            </tbody>
        </table>
    );
};

describe("DicomTableRow", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders the component without crashing", async () => {
        await act(async () => {
            setup();
        });
        expect(screen.getByText("Tag Name 1")).toBeInTheDocument();
        expect(screen.getByText("Value 1")).toBeInTheDocument();
    });

    test("handles toggle edit state on pencil click", async () => {
        await act(async () => {
            setup();
        });
        const editIcon = screen.getByLabelText("Edit Tag");
        fireEvent.click(editIcon);

        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("shows the delete tooltip when hovering over the delete icon", async () => {
        await act(async () => {
            setup();
        });
        const deleteIcon = screen.getByLabelText("Delete Tag");
        fireEvent.mouseOver(deleteIcon);

        await waitFor(() => {
            expect(screen.getByText("To Be Deleted")).toBeInTheDocument();
        });
    });

    test("expands and collapses nested rows when the expand icon is clicked", () => {
        const nestedRow = {
            tagId: "2",
            tagName: "Nested Tag",
            value: {
                tags: {
                    "3": {
                        tagId: "3",
                        tagName: "Nested Nested Tag",
                        value: "Nested Value",
                    },
                },
            },
        };

        setup({ row: nestedRow, nested: true });

        const expandIcon = screen.getByText("▶");
        fireEvent.click(expandIcon);

        expect(screen.getByText("Nested Nested Tag")).toBeInTheDocument();

        fireEvent.click(expandIcon);
        expect(screen.queryByText("Nested Nested Tag")).toBeNull();
    });

    test("does not display input when not editing", async () => {
        await act(async () => {
            setup();
        });
        expect(screen.getByText("Value 1")).toBeInTheDocument();
        expect(screen.queryByRole("textbox")).toBeNull();
    });
});
