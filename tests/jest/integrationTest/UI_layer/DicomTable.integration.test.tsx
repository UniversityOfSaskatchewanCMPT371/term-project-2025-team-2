import { render, screen, fireEvent, act } from "@testing-library/react";
import { DicomTable } from "@components/DicomData/TableComponents/DicomTable";
import {
  createFile,
  downloadDicomFile,
} from "@components/DicomData/DownloadFuncs";
import { tagUpdater } from "@components/DicomData/TagUpdater";
import logger from "@components/utils/Logger";
import * as storeModule from "@components/State/Store";

jest.mock("@components/DicomData/DownloadFuncs", () => ({
  createFile: jest.fn(),
  downloadDicomFile: jest.fn(),
}));

jest.mock("@components/DicomData/TagUpdater", () => ({
  tagUpdater: jest.fn(() => "updatedDicomData"),
}));

jest.mock("@components/utils/Logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
}));

jest.mock("@components/State/Store", () => {
  const actual = jest.requireActual("@components/State/Store");
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
          tags: {
            tag1: { tagId: "tag1", tagName: "tag1", value: "value1" },
            tag2: { tagId: "tag2", tagName: "tag2", value: "value2" },
          },
          DicomDataSet: "dicomData",
        },
      ],
      currentFileIndex: 0,
      newTagValues: [
        {
          fileName: "test.dcm",
          tagId: "tag1",
          newValue: "value2",
          delete: false,
        },
      ],
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

