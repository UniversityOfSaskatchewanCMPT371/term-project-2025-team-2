import { render, screen, fireEvent, act } from "@testing-library/react";
import DicomTable from "../../../../src/components/DicomData/TableComponents/DicomTable";
import {
    createFile,
    downloadDicomFile,
} from "../../../../src/components/DicomData/DownloadFuncs";
import { tagUpdater } from "../../../../src/components/DicomData/TagUpdater";
import logger from "../../../../src/components/utils/Logger";
import * as storeModule from "../../../../src/components/State/Store";

jest.mock("../../../../src/components/DicomData/DownloadFuncs", () => ({
    createFile: jest.fn(),
    downloadDicomFile: jest.fn(),
}));

jest.mock("../../../../src/components/DicomData/TagUpdater", () => ({
    tagUpdater: jest.fn(() => "updatedDicomData"),
}));

jest.mock("../../../../src/components/utils/Logger", () => ({
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
}));


jest.mock("../../../../src/components/State/Store", () => {
    const actual = jest.requireActual("../../../../src/components/State/Store");
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

    it("logs an error when no dicomData is available for the current file", async () => {
        mockState.dicomData = [{ tags: {} }];

        await act(async () => {
            render(<DicomTable />);
        });

        expect(logger.error).toHaveBeenCalledWith("No DICOM data available");
    });
});

