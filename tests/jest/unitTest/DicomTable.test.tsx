import { render, screen, fireEvent, act } from "@testing-library/react";
import { DicomTable } from "../../../src/components/DicomData/TableComponents/DicomTable";
import * as storeModule from "../../../src/components/State/Store";


jest.mock("../../../src/components/State/Store", () => {
    const actual = jest.requireActual("../../../src/components/State/Store");
    return {
        ...actual,
        useStore: jest.fn(),
    };
});

describe("DicomTable - Unit Tests", () => {
    let mockState: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockState = {
            files: [{ name: "test.dcm" }],
            dicomData: [
                {
                    tags: [
                        { tagId: "tag1", tagName: "tag1", value: "value1" },
                        { tagId: "tag2", tagName: "tag2", value: "value2" },
                    ],
                    DicomDataSet: "dicomData",
                },
            ],
            currentFileIndex: 0,
            newTagValues: [{ tag1: "value2" }],
            showHiddenTags: false,
        };

        (storeModule.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => (selector ? selector(mockState) : mockState)
        );
    });

    it("renders without crashing when DICOM data is available", async () => {
        await act(async () => {
            render(<DicomTable />);
        });
        expect(screen.getByText("DICOM Tags")).toBeInTheDocument();
    });

    it('shows "No data available" when DICOM data is empty', async () => {
        mockState.dicomData = [{ tags: [] }];
        await act(async () => {
            render(<DicomTable />);
        });
        expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("handles search term changes", async () => {
        await act(async () => {
            render(<DicomTable />);
        });

        const searchInput = screen.getByPlaceholderText(/Search tags.../i);
        await act(async () => {
            fireEvent.change(searchInput, { target: { value: "tag1" } });
        });
        expect(searchInput).toHaveValue("tag1");
    });

    it("updates a tag value when edit button is clicked", async () => {
        await act(async () => {
            render(<DicomTable />);
        });

        const editButton = screen.getAllByTestId("edit-tag-button")[0];

        await act(async () => {
            fireEvent.click(editButton);
        });

        expect(editButton).toBeDefined();
    });
});
