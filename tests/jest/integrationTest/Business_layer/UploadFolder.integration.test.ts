import { tagUpdater } from "../../../../src/DataFunctions/DicomData/TagUpdater";
import {
    parseDicomFiles,
    buildFileStructure,
} from "../../../../src/DataFunctions/DicomData/FileProcessor";
import { updateAllFiles } from "../../../../src/DataFunctions/DicomData/UpdateAllFiles";
import {
    createZipFromFiles,
    downloadDicomFile,
} from "../../../../src/DataFunctions/DicomData/DownloadFuncs";
import { parseDicomFile } from "../../../../src/DataFunctions/DicomData/DicomParserUtils";

import fs from "fs";
import path from "path";
import dicomParser from "dicom-parser";

jest.mock("../../../../src/DataFunctions/DicomData/DownloadFuncs.ts", () => ({
    ...jest.requireActual(
        "../../../../src/DataFunctions/DicomData/DownloadFuncs.ts"
    ),
    createZipFromFiles: jest.fn(() => new Blob()),
    downloadDicomFile: jest.fn(),
}));

const loadRealDicomFile = (filePath: string, baseDir: string): File => {
    const fileBuffer = fs.readFileSync(filePath);
    const file = new File([fileBuffer], path.basename(filePath), {
        type: "application/dicom",
    });

    const relativePath = path.relative(baseDir, filePath);

    Object.defineProperty(file, "webkitRelativePath", {
        value: relativePath,
        writable: true,
    });

    return file;
};

const loadDicomFilesRecursively = (dir: string, baseDir: string): File[] => {
    const entries = fs.readdirSync(dir);
    const files: File[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (entry === "broken_files") continue;
            files.push(...loadDicomFilesRecursively(fullPath, baseDir));
        } else if (stat.isFile() && entry.toLowerCase().endsWith(".dcm")) {
            files.push(loadRealDicomFile(fullPath, baseDir));
        }
    }

    return files;
};

const baseDir = path.join(
    __dirname,
    "../../../../test-data/test_dicoms/gen_dicom_files"
);
const realFiles = loadDicomFilesRecursively(baseDir, baseDir);

declare global {
    interface Global {
        indexedDB: {
            open: jest.Mock;
        };
    }
}

describe("Upload Folder Integration Test", () => {
    const toggleModal = jest.fn();
    const onError = jest.fn();
    const onProgress = jest.fn();

    beforeAll(() => {
        (globalThis as unknown as Global).indexedDB = {
            open: jest.fn(() => ({
                onerror: jest.fn(),
                onsuccess: jest.fn(),
                result: {},
            })),
        };
        jest.clearAllMocks();
    });
    test("should build correct folder structure from real DICOM files", () => {
        const structured = buildFileStructure(realFiles);

        const expectedFolders = ["root", "simple_files", "tagUpdater_testing"];

        expect(Object.keys(structured).sort()).toEqual(expectedFolders.sort());

        expect(structured["root"]).toHaveLength(100);
        expect(structured["simple_files"]).toHaveLength(4);
        expect(structured["tagUpdater_testing"]).toHaveLength(12);
    });

    test("should parse real DICOM files with parseDicomFiles", async () => {
        const result = await parseDicomFiles(
            realFiles,
            parseDicomFile,
            toggleModal,
            onError,
            onProgress
        );

        expect(result).toHaveLength(realFiles.length);
        expect(result.filter(Boolean).length).toBe(116);

        interface ParsedDicomEntry {
            fileName: string;
            filePath: string;
            tags: Record<string, any>;
        }

        result.forEach((entry: ParsedDicomEntry | null, i: number) => {
            if (entry !== null) {
                expect(entry.fileName).toBe(realFiles[i].name);
                expect(entry.filePath).toBe(
                    (realFiles[i] as any).webkitRelativePath ||
                        realFiles[i].name
                );
                expect(entry.tags).toBeDefined();
            }
        });

        expect(onProgress).toHaveBeenCalled();
    });

    test("should update Patient Name tag in a single REAL DICOM file", async () => {
        const parsed = await parseDicomFiles(
            realFiles,
            parseDicomFile,
            toggleModal,
            onError,
            onProgress
        );
        const original = parsed[0]!;
        const originalValue = original.tags["X00100010"]?.value;

        const newTagValues = [
            { tagId: "X00100010", newValue: "John Doe 9000" },
        ];

        const updatedBuffer = tagUpdater(original.DicomDataSet, newTagValues);
        const updatedDataset = dicomParser.parseDicom(updatedBuffer);
        const updatedName = updatedDataset.string("x00100010");

        expect(updatedName).not.toBe(originalValue);
        expect(updatedName).toBe("John Doe 9000");
    });

    test("should process REAL files individually when downloadOption is 'single'", async () => {
        const spy = jest.spyOn(
            await import("../../../../src/DataFunctions/DicomData/TagUpdater"),
            "tagUpdater"
        );

        const files = [
            { name: "test_dicom_0.dcm" },
            { name: "test_dicom_1.dcm" },
        ];
        const currentFileIndex = 0;
        const newTagValues = [
            {
                fileName: "test_dicom_0.dcm",
                tagId: "X00100010",
                newValue: "John Doe 9001",
                delete: false,
                add: false,
            },
            {
                fileName: "test_dicom_1.dcm",
                tagId: "X00100010",
                newValue: "John Doe 9002",
                delete: false,
                add: false,
            },
        ];

        const parsed = await parseDicomFiles(
            realFiles,
            parseDicomFile,
            toggleModal,
            onError,
            onProgress
        );

        await updateAllFiles(
            [parsed[0]!, parsed[1]!],
            true,
            newTagValues,
            files,
            currentFileIndex,
            "single",
            {},
            () => {}
        );

        expect(spy).toHaveBeenCalledTimes(2);
    });

    test("should call createZipFromFiles and downloadDicomFile when downloadOption is 'zip'", async () => {
        const parsed = await parseDicomFiles(
            realFiles,
            parseDicomFile,
            toggleModal,
            onError,
            onProgress
        );

        const files = [
            { name: "test_dicom_0.dcm" },
            { name: "test_dicom_1.dcm" },
        ];
        const currentFileIndex = 0;
        const newTagValues = [
            {
                fileName: "test_dicom_0.dcm",
                tagId: "X00100010",
                newValue: "John Doe 9010",
                delete: false,
                add: false,
            },
            {
                fileName: "test_dicom_1.dcm",
                tagId: "X00100010",
                newValue: "John Doe 9011",
                delete: false,
                add: false,
            },
        ];

        await updateAllFiles(
            [parsed[0]!, parsed[1]!],
            true,
            newTagValues,
            files,
            currentFileIndex,
            "zip",
            {},
            () => {}
        );

        expect(createZipFromFiles).toHaveBeenCalledTimes(1);
        expect(downloadDicomFile).toHaveBeenCalledTimes(3);

        const lastCallArg = (downloadDicomFile as jest.Mock).mock.calls.at(
            -1
        )?.[0];

        expect(lastCallArg.name).toBe("updateDicoms.zip");
        expect(lastCallArg.content).toBeInstanceOf(Blob);
    });
});
