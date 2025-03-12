import { TagDictionary } from "../../../../src/DataFunctions/TagDictionary/dictionary";
import { standardDataElements } from "../../../../src/DataFunctions/TagDictionary/standardDataElements";

describe("TagDictionary", () => {
    let tagDictionary: TagDictionary;

    beforeEach(() => {
        tagDictionary = new TagDictionary();
    });

    describe("lookupTagName", () => {
        it("should return the correct name for a valid tag", () => {
            const tag = "X00100010";
            const tagName = tagDictionary.lookupTagName(tag);
            const expectedName = standardDataElements["00100010"].name;

            expect(tagName).toBe(expectedName);
        });

        it("should return 'Unknown' for an invalid tag", () => {
            const invalidTag = "X99999999";
            const tagName = tagDictionary.lookupTagName(invalidTag);

            expect(tagName).toBe("Unknown");
        });

        it("should return 'Unknown' for a malformed tag", () => {
            const malformedTag = "X0010,0010";
            const tagName = tagDictionary.lookupTagName(malformedTag);

            expect(tagName).toBe("Unknown");
        });
    });

    describe("lookupTagVR", () => {
        it("should return the correct VR for a valid tag", () => {
            const tag = "X00100010";
            const tagVR = tagDictionary.lookupTagVR(tag);
            const expectedVR = standardDataElements["00100010"].vr;

            expect(tagVR).toBe(expectedVR);
        });

        it("should return 'Unknown' for an invalid tag", () => {
            const invalidTag = "X99999999";
            const tagVR = tagDictionary.lookupTagVR(invalidTag);

            expect(tagVR).toBe("Unknown");
        });
    });
});
