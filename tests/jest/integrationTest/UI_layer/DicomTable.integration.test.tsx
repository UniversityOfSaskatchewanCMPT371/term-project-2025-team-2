import { render, screen, fireEvent, act } from "@testing-library/react";
import { DicomTable } from "@features/DicomTagTable/Components/DicomTable";
import {
    createFile,
    downloadDicomFile,
} from "@dataFunctions/DicomData/DownloadFuncs";
import { tagUpdater } from "@dataFunctions/DicomData/TagUpdater";
// import logger from "@logger/Logger";
import * as storeModule from "@state/Store";

jest.mock("@dataFunctions/DicomData/DownloadFuncs", () => ({
    createFile: jest.fn(),
    downloadDicomFile: jest.fn(),
}));

jest.mock("@dataFunctions/DicomData/TagUpdater", () => ({
    tagUpdater: jest.fn(() => "updatedDicomData"),
}));

jest.mock("@state/Store", () => ({
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
}));

jest.mock("@state/Store", () => {
    const actual = jest.requireActual("@state/Store");
    return {
        ...actual,
        useStore: jest.fn(),
    };
});

describe("DicomTable - Integration Tests", () => {
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
            clearData: jest.fn(),
            setNewTagValues: jest.fn(),
            showHiddenTags: false,
        };

        (storeModule.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => (selector ? selector(mockState) : mockState)
        );
    });

    it("calls updateFile when save button is clicked", async () => {
        await act(async () => {
            render(<DicomTable />);
        });

        const saveButton = screen.getByText(/Download File/i);

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(tagUpdater).toHaveBeenCalledWith(
            "dicomData",
            mockState.newTagValues
        );
        expect(createFile).toHaveBeenCalled();
        expect(downloadDicomFile).toHaveBeenCalled();
        expect(mockState.clearData).toHaveBeenCalled();
    });

    // it("logs an error when no dicomData is available for the current file", async () => {
    //     mockState.dicomData = [{ tags: {} }];

    //     await act(async () => {
    //         render(<DicomTable />);
    //     });

    //     expect(logger.error).toHaveBeenCalledWith("No DICOM data available");
    // });
});
