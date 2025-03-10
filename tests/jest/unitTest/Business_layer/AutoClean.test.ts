// tests/jest/unitTest/Business_layer/AutoClean.test.ts
import { FormatData, AutoAnon } from '@components/Auto/AutoClean';
import { CustomFile } from "types/FileTypes";
import { AnonTag } from "types/DicomTypes";

// Mock the TagsAnon module to supply known tag values for testing.
jest.mock('@components/Auto/TagsAnon', () => ({
  TagsAnon: [
    { tagId: "0010,0010", value: "Anonymous" },
    { tagId: "0010,0020", value: "12345" }
  ]
}));

// Mock tagUpdater.
jest.mock('@components/DicomData/TagUpdater', () => ({
  tagUpdater: jest.fn((_: any, __: any) => {
    // Return a mock updated file (for example, an ArrayBuffer)
    return new ArrayBuffer(10);
  })
}));

// Mock DownloadFuncs.
jest.mock('@components/DicomData/DownloadFuncs', () => ({
  createFile: jest.fn((name: string, content: any) => ({ name, content })),
  createZipFromFiles: jest.fn((_: any[]) => Promise.resolve(new ArrayBuffer(20))),
  downloadDicomFile: jest.fn()
}));

import { tagUpdater } from '@components/DicomData/TagUpdater';
import { createFile, createZipFromFiles, downloadDicomFile } from '@components/DicomData/DownloadFuncs';

describe("AutoClean Module", () => {
  describe("FormatData", () => {
    it("should format dicom data correctly based on TagsAnon", () => {
      const sampleDicomData = {
        DicomDataSet: {
          elements: {
            "0010,0010": { vr: "PN", dataOffset: 100 },
            "0010,0020": { vr: "LO", dataOffset: 200 },
          },
        },
      };

      const result = FormatData(sampleDicomData);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        tagId: "0010,0010",
        newValue: "Anonymous",
        vr: "PN",
        dataOffSet: 100,
        length: "Anonymous".length,
        deleteTag: false,
      });
      expect(result[1]).toEqual({
        tagId: "0010,0020",
        newValue: "12345",
        vr: "LO",
        dataOffSet: 200,
        length: "12345".length,
        deleteTag: false,
      });
    });

    it("should skip tags not present in the dicom data", () => {
      const sampleDicomData = {
        DicomDataSet: {
          elements: {
            "0010,0010": { vr: "PN", dataOffset: 100 },
          },
        },
      };


      const result = FormatData(sampleDicomData);


      expect(result).toHaveLength(1);
      expect(result[0].tagId).toBe("0010,0010");
    });

    it('should handle missing VR by defaulting to "NO"', () => {
      const sampleDicomData = {
        DicomDataSet: {
          elements: {
            "0010,0010": { dataOffset: 100 }, 
          },
        },
      };

      const result = FormatData(sampleDicomData);

      expect(result[0].vr).toBe("NO");
    });
  });

  describe("AutoAnon", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should process dicom files, update tags, and trigger a download", async () => {
      const sampleDicomDataArray = [
        {
          DicomDataSet: {
            elements: {
              "0010,0010": { vr: "PN", dataOffset: 100 },
              "0010,0020": { vr: "LO", dataOffset: 200 },
            },
          },
        },
      ];

      const sampleFiles: CustomFile[] = [
        { name: "dicom1.dcm" },
      ];

      const sampleAnonTags: AnonTag[] = [
        { tagId: "0010,0010", newValue: "Custom Name", tagName: "PatientName" },
      ];


      await AutoAnon(sampleDicomDataArray, sampleFiles, sampleAnonTags);

      expect((tagUpdater as jest.Mock).mock.calls.length).toBe(1);

      const formattedDataPassed = (tagUpdater as jest.Mock).mock.calls[0][1];
      const updatedTag = formattedDataPassed.find((tag: any) => tag.tagId === "0010,0010");
      expect(updatedTag.newValue).toBe("Custom Name");

      expect(createFile).toHaveBeenCalledWith("dicom1.dcm", expect.any(ArrayBuffer));

      expect(createZipFromFiles).toHaveBeenCalledWith([
        { name: "dicom1.dcm", content: expect.any(ArrayBuffer) },
      ]);

      expect(downloadDicomFile).toHaveBeenCalledWith({
        name: "updateDicoms.zip",
        content: expect.any(ArrayBuffer),
      });
    });

    it("should handle anonTags that do not match any existing tags", async () => {
      const sampleDicomDataArray = [
        {
          DicomDataSet: {
            elements: {
              "0010,0010": { vr: "PN", dataOffset: 100 },
            },
          },
        },
      ];

      const sampleFiles: CustomFile[] = [
        { name: "dicom1.dcm" },
      ];


      const sampleAnonTags: AnonTag[] = [
        { tagId: "9999,9999", newValue: "Non-existent", tagName: "NonExistent" },
      ];


      await AutoAnon(sampleDicomDataArray, sampleFiles, sampleAnonTags);


      expect((tagUpdater as jest.Mock).mock.calls.length).toBe(1);
      expect(createFile).toHaveBeenCalledWith("dicom1.dcm", expect.any(ArrayBuffer));
      expect(createZipFromFiles).toHaveBeenCalled();
      expect(downloadDicomFile).toHaveBeenCalled();
    });
  });
});

