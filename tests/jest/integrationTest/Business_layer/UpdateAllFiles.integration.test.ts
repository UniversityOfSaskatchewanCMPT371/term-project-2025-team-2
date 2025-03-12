import { updateAllFiles } from "@components/DicomData/UpdateAllFiles";
import {
  createFile,
  downloadDicomFile,
  createZipFromFiles,
} from "@components/DicomData/DownloadFuncs";
import {
  tagUpdater,
  getSingleFileTagEdits,
} from "@components/DicomData/TagUpdater";

jest.mock("@components/DicomData/DownloadFuncs", () => ({
  createFile: jest.fn((name, content) => ({ name, content })),
  downloadDicomFile: jest.fn(),
  createZipFromFiles: jest.fn(async (files) => `mockZipContent(${files.length})`),
}));

jest.mock("@components/DicomData/TagUpdater", () => ({
    tagUpdater: jest.fn((dicomDataSet, edits) => `updated(${dicomDataSet}, ${JSON.stringify(edits)})`),
    getSingleFileTagEdits: jest.fn((_, fileName) => (
      fileName === "file1.dcm" || fileName === "file2.dcm"
        ? [{ fileName, tagId: "0010,0010", newValue: "Test", delete: false }]
        : []
    )),
  }));
  

describe("updateAllFiles", () => {
  let dicomData: { DicomDataSet: string }[];
  let files: { name: string }[];
  let currentFileIndex: number;
  let newTagValues: any[];
  let mockSetShowNoEditsModal: jest.Mock;

  beforeEach(() => {
    dicomData = [
      { DicomDataSet: "dicom1" },
      { DicomDataSet: "dicom2" },
    ];
    files = [
      { name: "file1.dcm" },
      { name: "file2.dcm" },
    ];
    currentFileIndex = 0;
    newTagValues = [
      { fileName: "file1.dcm", tagId: "0010,0010", newValue: "Test", delete: false },
      { fileName: "file2.dcm", tagId: "0010,0020", newValue: "Test2", delete: false },
    ];
    mockSetShowNoEditsModal = jest.fn();
    jest.clearAllMocks();
  });

  test("should process files individually when downloadOption is 'single'", async () => {
    await updateAllFiles(
      dicomData,
      true, // series mode
      newTagValues,
      files,
      currentFileIndex,
      "single",
      mockSetShowNoEditsModal
    );

    expect(tagUpdater).toHaveBeenCalledTimes(2);
    expect(getSingleFileTagEdits).toHaveBeenCalledTimes(1); // ✅ only once in series mode
    expect(createFile).toHaveBeenCalledTimes(2);
    expect(downloadDicomFile).toHaveBeenCalledTimes(2);
  });

  test("should process files and create a zip when downloadOption is 'zip'", async () => {
    await updateAllFiles(
      dicomData,
      true,
      newTagValues,
      files,
      currentFileIndex,
      "zip",
      mockSetShowNoEditsModal
    );

    expect(tagUpdater).toHaveBeenCalledTimes(2);
    expect(getSingleFileTagEdits).toHaveBeenCalledTimes(1); // ✅ still one
    expect(createFile).toHaveBeenCalledTimes(2);
    expect(createZipFromFiles).toHaveBeenCalledTimes(1);
    expect(downloadDicomFile).toHaveBeenCalledWith({
      name: "updateDicoms.zip",
      content: "mockZipContent(2)",
    });
  });

  test("should process files correctly when series is false", async () => {
    await updateAllFiles(
      dicomData,
      false, // non-series
      newTagValues,
      files,
      currentFileIndex,
      "single",
      mockSetShowNoEditsModal
    );

    expect(tagUpdater).toHaveBeenCalledTimes(2);
    expect(getSingleFileTagEdits).toHaveBeenCalledTimes(2); // ✅ called per file
    expect(createFile).toHaveBeenCalledTimes(2);
    expect(downloadDicomFile).toHaveBeenCalledTimes(2);
  });

  test("should handle empty dicomData gracefully", async () => {
    await updateAllFiles(
      [],
      true,
      newTagValues,
      files,
      currentFileIndex,
      "single",
      mockSetShowNoEditsModal
    );

    expect(tagUpdater).not.toHaveBeenCalled();
    expect(createFile).not.toHaveBeenCalled();
    expect(downloadDicomFile).not.toHaveBeenCalled();
  });
});
