import { render, screen } from "@testing-library/react";
import DicomTableBody from "../../../src/components/DicomData/TableComponents/DicomTableBody";

jest.mock("../../../src/components/DicomData/TableComponents/DicomTableRow", () => ({
    DicomTableRow: jest.fn(() => <tr data-testid="dicom-table-row"></tr>),
}));
jest.mock("../../../src/components/DicomData/TableComponents/EmptyTableRow", () => ({
    __esModule: true,
    default: jest.fn(() => <tr data-testid="empty-table-row"></tr>),
}));

const mockOnUpdateValue = jest.fn();

describe("DicomTableBody Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders without crashing", () => {
        render(<DicomTableBody filteredRows={[]} showHidden={false} onUpdateValue={mockOnUpdateValue} />);
        expect(screen.getByTestId("empty-table-row")).toBeInTheDocument();
    });

    test("renders DicomTableRow when filteredRows is not empty", () => {
        const mockRows = [
            { tagId: "00100010", tagName: "Patient Name", value: "John Doe", hidden: false, updated: false },
            { tagId: "00100020", tagName: "Patient ID", value: "123456", hidden: false, updated: false },
        ];

        render(<DicomTableBody filteredRows={mockRows} showHidden={false} onUpdateValue={mockOnUpdateValue} />);

        expect(screen.getAllByTestId("dicom-table-row")).toHaveLength(mockRows.length);
    });

    test("hides hidden rows when showHidden is false", () => {
        const mockRows = [
            { tagId: "00100010", tagName: "Patient Name", value: "John Doe", hidden: false, updated: false },
            { tagId: "00100020", tagName: "Patient ID", value: "123456", hidden: true, updated: false }, // Should be hidden
        ];

        render(<DicomTableBody filteredRows={mockRows} showHidden={false} onUpdateValue={mockOnUpdateValue} />);

        expect(screen.getAllByTestId("dicom-table-row")).toHaveLength(1);
    });

    test("shows hidden rows when showHidden is true", () => {
        const mockRows = [
            { tagId: "00100010", tagName: "Patient Name", value: "John Doe", hidden: false, updated: false },
            { tagId: "00100020", tagName: "Patient ID", value: "123456", hidden: true, updated: false },
        ];

        render(<DicomTableBody filteredRows={mockRows} showHidden={true} onUpdateValue={mockOnUpdateValue} />);

        expect(screen.getAllByTestId("dicom-table-row")).toHaveLength(2);
    });

    test("renders EmptyTableRow when filteredRows is empty", () => {
        render(<DicomTableBody filteredRows={[]} showHidden={false} onUpdateValue={mockOnUpdateValue} />);
        expect(screen.getByTestId("empty-table-row")).toBeInTheDocument();
    });
});

