import {
    createZipFromFiles,
    downloadDicomFile,
    createFile,
} from "../../../src/components/DicomData/DownloadFuncs";
import { FileData } from "../../../src/types/FileTypes";

describe("Download Functions", () => {
    beforeEach(() => {
        global.URL.createObjectURL = jest.fn(() => "mock-url");
        global.URL.revokeObjectURL = jest.fn();

        const createElementMock = jest.spyOn(document, "createElement");
        createElementMock.mockImplementation(() => {
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

    it("should create a zip file from files", async () => {
        const files: FileData[] = [
            { name: "file1.txt", content: new Blob(["content1"]) },
            { name: "file2.txt", content: new Blob(["content2"]) },
        ];

        const zipBlob = await createZipFromFiles(files);

        expect(zipBlob).toBeInstanceOf(Blob);
        expect(zipBlob.type).toBe("application/zip");
    });

    it("should create a new DICOM file object with correct name", () => {
        const blobData = "sample content";
        const fileName = "original.dcm";

        const newFile = createFile(fileName, blobData);

        expect(newFile.name).toBe("original_edited.dcm");
        expect(newFile.content).toBeInstanceOf(Blob);
    });
});
