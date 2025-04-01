import { tagUpdater } from "@dataFunctions/DicomData/TagUpdater";
import {
    parseDicomFiles,
    buildFileStructure,
} from "@dataFunctions/DicomData/FileProcessor";
import { updateAllFiles } from "@dataFunctions/DicomData/UpdateAllFiles";
import {
    createZipFromFiles,
    downloadDicomFile,
} from "@dataFunctions/DicomData/DownloadFuncs";
import { parseDicomFile } from "@dataFunctions/DicomData/DicomParserUtils";

import fs from "fs";
import path from "path";
import dicomParser from "dicom-parser";

jest.mock("@dataFunctions/DicomData/DownloadFuncs.ts", () => ({
    ...jest.requireActual("@dataFunctions/DicomData/DownloadFuncs.ts"),
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

        const expectedFolders = Array.from(
            new Set(
                realFiles.map((file) => {
                    const path = (file as any).webkitRelativePath || file.name;
                    return path.split("/").slice(0, -1).join("/") || "root";
                })
            )
        ).sort();

        const actualFolders = Object.keys(structured).sort();

        expect(actualFolders).toEqual(expectedFolders);

        expectedFolders.forEach((folder) => {
            const expectedCount = realFiles.filter((file) => {
                const path = (file as any).webkitRelativePath || file.name;
                const dir = path.split("/").slice(0, -1).join("/") || "root";
                return dir === folder;
            }).length;

            expect(structured[folder]).toHaveLength(expectedCount);
        });
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
        expect(result.filter(Boolean).length).toBe(realFiles.length);

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
            await import("@dataFunctions/DicomData/TagUpdater"),
            "tagUpdater"
        );

        const file1 = realFiles[0];
        const file2 = realFiles[1];
        const files = [{ name: file1.name, content: new Blob }, { name: file2.name, content: new Blob }];

        const newTagValues = [
            {
                fileName: file1.name,
                tagId: "X00100010",
                newValue: "John Doe 9001",
                delete: false,
                add: false,
            },
            {
                fileName: file2.name,
                tagId: "X00100010",
                newValue: "John Doe 9002",
                delete: false,
                add: false,
            },
        ];

        const currentFileIndex = 0;

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

        const file1 = realFiles[0];
        const file2 = realFiles[1];
        const files = [{ name: file1.name, content: new Blob }, { name: file2.name, content: new Blob }];

        const newTagValues = [
            {
                fileName: file1.name,
                tagId: "X00100010",
                newValue: "John Doe 9010",
                delete: false,
                add: false,
            },
            {
                fileName: file2.name,
                tagId: "X00100010",
                newValue: "John Doe 9011",
                delete: false,
                add: false,
            },
        ];

        const currentFileIndex = 0;

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
