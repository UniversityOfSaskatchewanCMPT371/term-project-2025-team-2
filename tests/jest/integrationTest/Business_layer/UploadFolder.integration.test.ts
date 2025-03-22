import { processFiles } from "./FileProcessor";
import { tagUpdater } from "../../../../src/DataFunctions/DicomData/TagUpdater";
import { updateAllFiles } from "../../../../src/DataFunctions/DicomData/UpdateAllFiles";
import {
    createZipFromFiles,
    downloadDicomFile,
} from "../../../../src/DataFunctions/DicomData/DownloadFuncs";

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
    beforeAll(() => {
        // Now assign it safely
        (globalThis as unknown as Global).indexedDB = {
            open: jest.fn(() => ({
                onerror: jest.fn(),
                onsuccess: jest.fn(),
                result: {},
            })),
        };

        jest.clearAllMocks();
    });

    test("should preserve folder structure and parse DICOM files correctly", async () => {
        const result = await processFiles(realFiles);

        expect(Object.keys(result.structuredFiles).sort()).toEqual(
            ["root", "simple_files", "tagUpdater_testing"].sort()
        );

        expect(result.structuredFiles["root"]).toHaveLength(100);
        expect(result.structuredFiles["simple_files"]).toHaveLength(4);
        expect(result.structuredFiles["tagUpdater_testing"]).toHaveLength(12);
        expect(result.parsedData).toHaveLength(116);
    });

    test("should update Patient Name tag in a single REAL DICOM file", async () => {
        const result = await processFiles(realFiles);

        const original = result.parsedData[0];
        const originalValue = original.tags["X00100010"]?.value;

        const newTagValues = [
            {
                tagId: "X00100010",
                newValue: "John Doe 9000",
            },
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
        const result = await processFiles(realFiles);
        await updateAllFiles(
            [result.parsedData[0], result.parsedData[1]],
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
        const result = await processFiles(realFiles);

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
            [result.parsedData[0], result.parsedData[1]],
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
