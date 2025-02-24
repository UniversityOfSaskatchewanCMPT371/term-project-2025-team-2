import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import DicomTable from "../../src/components/DicomData/TableComponents/DicomTable";

describe("DicomTable Component - Edit and Delete Actions", () => {
    const mockUpdateTableData = jest.fn();
    const mockClearData = jest.fn();

    const mockDicomData = {
        tags: {
            "0010,0010": { tagName: "Patient Name", value: "John Doe" },
            "0010,0020": { tagName: "Patient ID", value: "123456" },
        },
        DicomDataSet: {},
    };

    const mockNewTableData = [
        { fileName: "test.dcm", tagId: "0010,0010", newValue: "Jane Doe" },
    ];

    const defaultProps = {
        dicomData: mockDicomData,
        fileName: "test.dcm",
        updateTableData: mockUpdateTableData,
        newTableData: mockNewTableData,
        clearData: mockClearData,
        showHiddenTags: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("edits a DICOM tag value", async () => {
        await act(async () => {
            render(<DicomTable {...defaultProps} />);
        });

        // Find all edit buttons and select the correct one by index
        const editButtons = screen.queryAllByLabelText("Edit Tag");
        expect(editButtons.length).toBeGreaterThan(1);

        await act(async () => {
            fireEvent.click(editButtons[0]); // Select the first edit button
        });

        // Find all input fields and select the correct one for editing
        const inputFields = screen.queryAllByRole("textbox");
        expect(inputFields.length).toBeGreaterThan(1);

        const editInput = inputFields[1]; // Assume the second textbox is for editing the DICOM tag
        await act(async () => {
            fireEvent.change(editInput, { target: { value: "Jane Doe" } });
            fireEvent.blur(editInput); // Simulate input blur to trigger the update
        });

        await waitFor(() =>
            expect(mockUpdateTableData).toHaveBeenCalledWith({
                fileName: "test.dcm",
                tagId: "0010,0010",
                newValue: "Jane Doe",
                delete: false,
            })
        );

        expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    test("handles delete tag action", async () => {
        await act(async () => {
            render(<DicomTable {...defaultProps} />);
        });

        // Find all delete buttons and select the correct one by index
        const deleteButtons = screen.queryAllByLabelText("Delete Tag");
        expect(deleteButtons.length).toBeGreaterThan(1);

        await act(async () => {
            fireEvent.click(deleteButtons[0]); // Select the first delete button
        });

        await waitFor(() =>
            expect(mockUpdateTableData).toHaveBeenCalledWith({
                fileName: "test.dcm",
                tagId: "0010,0010",
                newValue: "Jane Doe",
                delete: true,
            })
        );

        expect(deleteButtons[0]).toHaveClass("text-red-600");
    });
});
