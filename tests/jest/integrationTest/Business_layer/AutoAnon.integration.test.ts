import { AutoAnon } from "@features/AutoAnonymize/Functions/AutoClean";
import {
    createFile,
    createZipFromFiles,
    downloadDicomFile,
} from "@dataFunctions/DicomData/DownloadFuncs";
import { DicomData } from "@features/DicomTagTable/Types/DicomTypes";
import { parseDicomFile } from "@dataFunctions/DicomData/DicomParserUtils";
import dicomParser from "dicom-parser";

jest.mock("@dataFunctions/DicomData/DownloadFuncs", () => ({
    createFile: jest.fn((name, content) => ({ name, content })),
    createZipFromFiles: jest.fn(() => Promise.resolve(new Blob())),
    downloadDicomFile: jest.fn(),
}));

function createFileObj(path: string, name: string): File | null {
    try {
        const fs = require("fs");
        const fileBuffer = fs.readFileSync(path);
        return new File([fileBuffer], name, {
            type: "application/dicom",
        });
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}

function getElementValue(bytes: Uint8Array, tag: string): string | undefined {
    try {
        const dataSet = dicomParser.parseDicom(bytes);
        return dataSet.string(tag);
    } catch (e) {
        console.error("Failed to parse with dicomParser:", e);
        return undefined;
    }
}

describe("Auto Anonymizing Test (dicomParser direct)", () => {
    let sampleDicomData: DicomData[] = [];
    let dicomFiles: File[] = [];
    const filenames = [
        "test_dicom_0.dcm",
        "test_dicom_1.dcm",
        "test_dicom_2.dcm",
        "test_dicom_3.dcm",
    ];

    beforeEach(async () => {
        sampleDicomData = [];
        dicomFiles = [];

        for (const filename of filenames) {
            const filePath = `test-data/test_dicoms/gen_dicom_files/simple_files/${filename}`;
            const dicomFile = createFileObj(filePath, filename);
            if (!dicomFile) continue;

            dicomFiles.push(dicomFile);

            try {
                const parsed = await parseDicomFile(dicomFile);
                sampleDicomData.push(parsed);
            } catch (err) {
                console.error("Error parsing DICOM:", err);
            }
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should update tags and create/download ZIP", async () => {
        expect(sampleDicomData.length).toBe(4);
        expect(dicomFiles.length).toBe(4);

        const anonTags = [
            {
                tagId: "x00100010",
                newValue: "Anonymous",
                tagName: "PatientName",
            },
            { tagId: "x00100020", newValue: "Anonymous", tagName: "PatientID" },
        ];

        const tagsToAnon = [
            { tagId: "x00100010", value: "Anonymous" },
            { tagId: "x00100020", value: "Anonymous" },
        ];

        const folderStructure: Record<string, File[]> = {
            "root/": [dicomFiles[0]],
        };

        await AutoAnon(
            sampleDicomData,
            dicomFiles,
            anonTags,
            tagsToAnon,
            folderStructure
        );

        const updatedBytes = (createFile as jest.Mock).mock.calls[0][1];

        const value1 = getElementValue(updatedBytes, "x00100010");
        const value2 = getElementValue(updatedBytes, "x00100020");

        expect(value1).toBe("Anonymous");
        expect(value2).toBe("Anonymous");

        expect(createFile).toHaveBeenCalledWith(
            dicomFiles[0].name,
            expect.any(Uint8Array),
            true
        );

        const zipInputFiles = (createZipFromFiles as jest.Mock).mock
            .calls[0][0];
        expect(zipInputFiles[0].path).toBe("root/");
        expect(createZipFromFiles).toHaveBeenCalledTimes(1);
        expect(downloadDicomFile).toHaveBeenCalledWith({
            name: "anonymized_dicoms.zip",
            content: expect.any(Blob),
        });
    });
});
