import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import DicomTable from "../../src/components/DicomData/DicomTable"; // Update the path accordingly
import Logger from "../../src/components/utils/Logger";
import * as tagUpdater from "../../src/components/DicomData/TagUpdater";

// Mock the logger
jest.mock("../../src/components/utils/Logger", () => ({
    error: jest.fn(),
}));

// Mock the functions imported from TagUpdater.tsx
jest.mock("../../src/components/DicomData/TagUpdater", () => ({
    tagUpdater: jest.fn(),
    downloadDicomFile: jest.fn(),
    createFile: jest.fn(),
}));

describe("DicomTable Component", () => {
    const mockUpdateTableData = jest.fn();
    const mockClearData = jest.fn();

    // Correct structure for mockDicomData
    const mockDicomData = {
        tags: {
            "1": {
                tagName: "PatientName",
                value: "John Doe",
                hidden: false,
            },
            "2": {
                tagName: "StudyDate",
                value: "2022-01-01",
                hidden: false,
            },
            "3": {
                tagName: "StudyID",
                value: "12345",
                hidden: true,
            },
        },
    };

    const mockNewTableData = [
        {
            fileName: "file1.dcm",
            tagId: "1",
            newValue: "Jane Doe",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the component without crashing", async () => {
        await act(async () => {
            render(
                <DicomTable
                    dicomData={mockDicomData}
                    fileName="file1.dcm"
                    updateTableData={mockUpdateTableData}
                    newTableData={mockNewTableData}
                    clearData={mockClearData}
                />
            );
        });
        expect(screen.getByText(/DICOM Tags/i)).toBeInTheDocument();
        expect(screen.getByText(/Save Single File Edits/i)).toBeInTheDocument();
        expect(screen.getByText(/Show Hidden Tags/i)).toBeInTheDocument();
    });

    test("logs an error if no dicomData is passed", () => {
        render(
            <DicomTable
                dicomData={{}}
                fileName="file1.dcm"
                updateTableData={mockUpdateTableData}
                newTableData={mockNewTableData}
                clearData={mockClearData}
            />
        );
        expect(screen.getByText(/No data available/i)).toBeInTheDocument();
        expect(Logger.error).toHaveBeenCalledWith("No DICOM data available");
    });

    test("filters rows based on search term", async () => {
        render(
            <DicomTable
                dicomData={mockDicomData}
                fileName="file1.dcm"
                updateTableData={mockUpdateTableData}
                newTableData={[]}
                clearData={mockClearData}
            />
        );

        const searchInput = screen.getByPlaceholderText(/Search/i); // assuming your Search component has this placeholder
        fireEvent.change(searchInput, { target: { value: "PatientName" } });

        await waitFor(() => {
            expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
            expect(screen.queryByText(/StudyDate/i)).not.toBeInTheDocument();
        });
    });

    test("toggles visibility of hidden tags", async () => {
        render(
            <DicomTable
                dicomData={mockDicomData}
                fileName="file1.dcm"
                updateTableData={mockUpdateTableData}
                newTableData={mockNewTableData}
                clearData={mockClearData}
            />
        );

        const showHideButton = screen.getByText(/Show Hidden Tags/i);
        fireEvent.click(showHideButton);

        await waitFor(() => {
            expect(screen.getByText(/StudyID/i)).toBeInTheDocument();
            expect(screen.getByText(/Hide Hidden Tags/i)).toBeInTheDocument();
        });

        fireEvent.click(showHideButton);

        await waitFor(() => {
            expect(screen.queryByText(/StudyID/i)).not.toBeInTheDocument();
            expect(screen.getByText(/Show Hidden Tags/i)).toBeInTheDocument();
        });
    });

    test("calls updateTableData when updating a tag value", async () => {
        render(
            <DicomTable
                dicomData={mockDicomData}
                fileName="file1.dcm"
                updateTableData={mockUpdateTableData}
                newTableData={mockNewTableData}
                clearData={mockClearData}
            />
        );

        const updateButton = screen.getByText(/Save Single File Edits/i);
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockUpdateTableData).toHaveBeenCalledTimes(0);
        });
    });

    test("calls downloadDicomFile and clearData when updating a file", async () => {
        render(
            <DicomTable
                dicomData={mockDicomData}
                fileName="file1.dcm"
                updateTableData={mockUpdateTableData}
                newTableData={mockNewTableData}
                clearData={mockClearData}
            />
        );

        const updateButton = screen.getByText(/Save Single File Edits/i);
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockClearData).toHaveBeenCalled();
            expect(tagUpdater.downloadDicomFile).toHaveBeenCalled();
            expect(tagUpdater.createFile).toHaveBeenCalled();
        });
    });
});
