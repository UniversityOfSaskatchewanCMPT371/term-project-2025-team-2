import {
    createZipFromFiles,
    downloadDicomFile,
    createFile,
} from "@dataFunctions/DicomData/DownloadFuncs";
import { FileData } from "@features/FileHandling/Types/FileTypes";

jest.mock("jszip", () => {
    return jest.fn().mockImplementation(() => ({
        file: jest.fn(),
        generateAsync: jest
            .fn()
            .mockResolvedValue(new Blob([], { type: "application/zip" })),
    }));
});

describe("Download Functions", () => {
    beforeEach(() => {
        global.URL.createObjectURL = jest.fn(() => "mock-url");
        global.URL.revokeObjectURL = jest.fn();

        jest.spyOn(document, "createElement").mockImplementation(() => {
            const element: any = {};
            element.click = jest.fn();
            element.setAttribute = jest.fn();
            document.body.appendChild = jest.fn();
            document.body.removeChild = jest.fn();
            return element;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should download a single file", () => {
        const fileData: FileData = {
            name: "testFile.dcm",
            content: new Blob(["test content"], { type: "application/dicom" }),
        };

        downloadDicomFile(fileData);

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(
            fileData.content
        );
        expect(document.createElement).toHaveBeenCalledWith("a");
        expect(document.body.appendChild).toHaveBeenCalled();
        expect(document.body.removeChild).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
    });

    it("should handle missing content in downloadDicomFile gracefully", () => {
        const fileData: FileData = {
            name: "testFile.dcm",
            content: null as any,
        };

        expect(() => downloadDicomFile(fileData)).not.toThrow();
    });

    it("should handle missing name in downloadDicomFile gracefully", () => {
        const fileData: FileData = {
            name: "",
            content: new Blob(["test content"], { type: "application/dicom" }),
        };

        expect(() => downloadDicomFile(fileData)).not.toThrow();
    });

    it("should create a zip file from files", async () => {
        const files: FileData[] = [
            { name: "file1.txt", content: new Blob(["content1"]) },
            { name: "file2.txt", content: new Blob(["content2"]) },
        ];

        const zipBlob = await createZipFromFiles(files);

        expect(zipBlob).toBeInstanceOf(Blob);
        expect(zipBlob.type).toBe("application/zip");
    });

    it("should handle empty file list in createZipFromFiles gracefully", async () => {
        const zipBlob = await createZipFromFiles([]);

        expect(zipBlob).toBeInstanceOf(Blob);
    });

    it("should create a new DICOM file object with correct name", () => {
        const blobData = "sample content" as unknown as Blob;
        const fileName = "original.dcm";

        const newFile = createFile(fileName, blobData, true);

        expect(newFile.name).toBe("original_edited.dcm");
        expect(newFile.content).toBeInstanceOf(Blob);
    });

    it("should create a file without .dcm extension correctly", () => {
        const blobData = "sample content" as unknown as Blob;
        const fileName = "original";

        const newFile = createFile(fileName, blobData, true);

        expect(newFile.name).toBe("original_edited.dcm");
    });

    it("should create a file that is already edited", () => {
        const blobData = "sample content" as unknown as Blob;
        const fileName = "original_edited.dcm";

        const newFile = createFile(fileName, blobData, true);

        expect(newFile.name).toBe("original_edited_edited.dcm");
    });
});
