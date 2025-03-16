import { updateAllFiles } from "@dataFunctions/DicomData/UpdateAllFiles";
import {
    createFile,
    downloadDicomFile,
    createZipFromFiles,
} from "@dataFunctions/DicomData/DownloadFuncs";
import {
    tagUpdater,
    getSingleFileTagEdits,
} from "@dataFunctions/DicomData/TagUpdater";

jest.mock("@dataFunctions/DicomData/DownloadFuncs", () => ({
    createFile: jest.fn((name, content) => ({ name, content })),
    downloadDicomFile: jest.fn(),
    createZipFromFiles: jest.fn(
        async (files) => `mockZipContent(${files.length})`
    ),
}));

jest.mock("@dataFunctions/DicomData/TagUpdater", () => ({
    tagUpdater: jest.fn(
        (dicomDataSet, edits) =>
            `updated(${dicomDataSet}, ${JSON.stringify(edits)})`
    ),
    getSingleFileTagEdits: jest.fn(() => "mockEdits"),
}));

describe("updateAllFiles", () => {
    let dicomData: { DicomDataSet: string, tags: {} }[];
    let files: { name: string }[];
    let currentFileIndex: number;
    let newTagValues: {tagId: string, tagName: string, value: string};

    beforeEach(() => {
        dicomData = [{ DicomDataSet: "dicom1", tags: {}}, { DicomDataSet: "dicom2", tags: {} }];
        files = [{ name: "file1.dcm" }, { name: "file2.dcm" }];
        currentFileIndex = 0;
        newTagValues = { tagId: "00100010", tagName: "PatientName", value: "John Doe" };

        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("should process files individually when downloadOption is 'single'", async () => {
        await updateAllFiles(
            dicomData,
            true,
            newTagValues,
            files,
            currentFileIndex,
            "single"
        );

        expect(tagUpdater).toHaveBeenCalledTimes(2);
        expect(getSingleFileTagEdits).toHaveBeenCalledTimes(2);
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
            "zip"
        );

        expect(tagUpdater).toHaveBeenCalledTimes(2);
        expect(getSingleFileTagEdits).toHaveBeenCalledTimes(2);
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
            false,
            newTagValues,
            files,
            currentFileIndex,
            "single"
        );

        expect(tagUpdater).toHaveBeenCalledTimes(2);
        expect(getSingleFileTagEdits).toHaveBeenCalledTimes(2);
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
            "single"
        );

        expect(tagUpdater).not.toHaveBeenCalled();
        expect(getSingleFileTagEdits).not.toHaveBeenCalled();
        expect(createFile).not.toHaveBeenCalled();
        expect(downloadDicomFile).not.toHaveBeenCalled();
    });
});
