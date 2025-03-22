import {
    createZipFromFiles,
    downloadDicomFile,
    createFile,
} from "@dataFunctions/DicomData/DownloadFuncs";
import { FileData } from "@features/FileHandling/Types/FileTypes";
import JSZip from "jszip";

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

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(fileData.content);
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

    it("should create a zip file from files without path but with slash in name", async () => {
        const files: FileData[] = [
            { name: "folder1/file1.txt", content: new Blob(["content1"]) },
        ];

        const zipBlob = await createZipFromFiles(files);

        expect(zipBlob).toBeInstanceOf(Blob);
        expect(zipBlob.type).toBe("application/zip");

        const mockZip = (JSZip as unknown as jest.Mock).mock.results[0].value;
        expect(mockZip.file).toHaveBeenCalledWith("folder1/file1.txt", expect.any(Blob));
    });

    it("should create a zip file from files with explicit path", async () => {
        const files: FileData[] = [
            { name: "file1.txt", content: new Blob(["content1"]), path: "custom/folder" },
        ];

        const zipBlob = await createZipFromFiles(files);

        expect(zipBlob).toBeInstanceOf(Blob);
        const mockZip = (JSZip as unknown as jest.Mock).mock.results[0].value;
        expect(mockZip.file).toHaveBeenCalledWith("custom/folder/file1.txt", expect.any(Blob));
    });

    it("should handle empty file list in createZipFromFiles", async () => {
        const zipBlob = await createZipFromFiles([]);

        expect(zipBlob).toBeInstanceOf(Blob);
    });

    it("should throw error if zip generation fails", async () => {
        const originalJSZip = (JSZip as unknown as jest.Mock).mockImplementation(() => ({
            file: jest.fn(),
            generateAsync: jest.fn().mockRejectedValue(new Error("zip failed")),
        }));

        const files: FileData[] = [{ name: "test.txt", content: new Blob(["x"]) }];

        await expect(createZipFromFiles(files)).rejects.toThrow("Failed to create ZIP");

        // Restore the original
        (JSZip as unknown as jest.Mock).mockImplementation(originalJSZip);
    });

    it("should create a new DICOM file with correct edited name", () => {
        const blobData = "sample content" as unknown as Blob;
        const fileName = "original.dcm";

        const newFile = createFile(fileName, blobData, true);
        expect(newFile.name).toBe("original_edited.dcm");
        expect(newFile.content).toBeInstanceOf(Blob);
    });

    it("should create a file with no .dcm extension", () => {
        const blobData = "sample content" as unknown as Blob;
        const fileName = "noExtension";

        const newFile = createFile(fileName, blobData, false);
        expect(newFile.name).toBe("noExtension.dcm");
    });

    it("should append _edited to already edited file name", () => {
        const blobData = "sample content" as unknown as Blob;
        const fileName = "scan_edited.dcm";

        const newFile = createFile(fileName, blobData, true);
        expect(newFile.name).toBe("scan_edited_edited.dcm");
    });

    it("should create file object with empty path", () => {
        const blobData = "sample content" as unknown as Blob;
        const fileName = "image.dcm";

        const newFile = createFile(fileName, blobData, false);
        expect(newFile.path).toBe("");
    });
});
