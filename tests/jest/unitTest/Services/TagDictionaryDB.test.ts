import { TagDictionaryDB, TagDictionaryItem } from "@services/TagDictionaryDB";
import { standardDataElements } from "@dataFunctions/TagDictionary/standardDataElements";

// Mock IndexedDB
const mockIndexedDB = {
    open: jest.fn(),
    deleteDatabase: jest.fn(),
};

// Mock IDBObjectStore
const mockObjectStore = {
    get: jest.fn(),
    getAll: jest.fn(),
    add: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    createIndex: jest.fn(),
};

// Mock IDBTransaction
const mockTransaction = {
    objectStore: jest.fn().mockReturnValue(mockObjectStore),
};

// Mock IDBDatabase
const mockDB = {
    transaction: jest.fn().mockReturnValue(mockTransaction),
    close: jest.fn(),
    objectStoreNames: {
        contains: jest.fn().mockReturnValue(false),
    },
    createObjectStore: jest.fn().mockReturnValue(mockObjectStore),
};

// Mock request objects
const mockSuccessRequest: {
    result: any;
    onsuccess: null | ((event: any) => void);
    onerror: null | ((event: any) => void);
    onupgradeneeded: null | ((event: any) => void);
    onblocked: null | ((event: any) => void);
    error: null | Error;
} = {
    result: null,
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
    onblocked: null,
    error: null,
};

// Mock File and FileReader
global.File = jest.fn().mockImplementation(() => ({})) as any;
global.FileReader = jest.fn().mockImplementation(() => ({
    readAsText: jest.fn(),
    onload: null,
    onerror: null,
    result: "[]",
    error: null,
})) as any;

// Mock URL methods
global.URL.createObjectURL = jest.fn().mockReturnValue("mock-url");
global.URL.revokeObjectURL = jest.fn();

// Mock document methods
document.createElement = jest.fn().mockImplementation(() => ({
    click: jest.fn(),
    download: "",
    href: "",
}));
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

describe("TagDictionaryDB", () => {
    let tagDictionaryDB: TagDictionaryDB;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Set up the indexedDB mock
        global.indexedDB = mockIndexedDB as any;

        // Create a fresh instance for each test
        tagDictionaryDB = new TagDictionaryDB();

        // Set up mock implementations for common operations
        mockDB.transaction.mockReturnValue(mockTransaction);
        mockTransaction.objectStore.mockReturnValue(mockObjectStore);

        // Set up default success behavior for IDB requests
        const setupSuccessRequest = () => {
            const request = { ...mockSuccessRequest };

            // Mock the assignment of success handlers to immediately call them
            Object.defineProperty(request, "onsuccess", {
                set(handler) {
                    if (handler)
                        setTimeout(() => handler({ target: request }), 0);
                },
            });

            return request;
        };

        // Setup default mock behaviors
        mockIndexedDB.open.mockImplementation(() => {
            const request = setupSuccessRequest();
            request.result = mockDB;

            // Simulate onupgradeneeded
            setTimeout(() => {
                if (request.onupgradeneeded) {
                    request.onupgradeneeded({ target: request });
                }
            }, 0);

            return request;
        });

        mockObjectStore.get.mockImplementation(() => {
            const request = setupSuccessRequest();
            request.result = null; // Default to not found
            return request;
        });

        mockObjectStore.getAll.mockImplementation(() => {
            const request = setupSuccessRequest();
            request.result = []; // Default to empty array
            return request;
        });

        mockObjectStore.add.mockImplementation(() => {
            return setupSuccessRequest();
        });

        mockObjectStore.put.mockImplementation(() => {
            return setupSuccessRequest();
        });

        mockObjectStore.delete.mockImplementation(() => {
            return setupSuccessRequest();
        });

        mockObjectStore.clear.mockImplementation(() => {
            return setupSuccessRequest();
        });
    });

    describe("initDB", () => {
        it("should initialize the database successfully", async () => {
            const result = await tagDictionaryDB.initDB();

            expect(result).toBe(true);
            expect(mockIndexedDB.open).toHaveBeenCalledWith(
                "TagDictionaryDB",
                1
            );
        });

        it("should create object store if it doesn't exist", async () => {
            mockDB.objectStoreNames.contains.mockReturnValueOnce(false);

            await tagDictionaryDB.initDB();

            expect(mockDB.createObjectStore).toHaveBeenCalledWith("tags", {
                keyPath: "tagId",
            });
            expect(mockObjectStore.createIndex).toHaveBeenCalledWith(
                "name",
                "name",
                { unique: false }
            );
        });

        it("should handle errors when opening database", async () => {
            mockIndexedDB.open.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                setTimeout(() => {
                    if (request.onerror) {
                        request.error = new Error("Test error");
                        request.onerror({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.initDB();

            expect(result).toBe(false);
        });
    });

    describe("getAllTags", () => {
        it("should return all tags from the database", async () => {
            const mockTags: TagDictionaryItem[] = [
                { tagId: "00100010", name: "Patient Name", vr: "PN" },
                { tagId: "00100020", name: "Patient ID", vr: "LO" },
            ];

            mockObjectStore.getAll.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                request.result = mockTags;
                setTimeout(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.getAllTags();

            expect(result).toEqual(mockTags);
            expect(mockTransaction.objectStore).toHaveBeenCalledWith("tags");
            expect(mockObjectStore.getAll).toHaveBeenCalled();
        });

        it("should return empty array if database is not available", async () => {
            // Force initDB to fail
            mockIndexedDB.open.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                setTimeout(() => {
                    if (request.onerror) {
                        request.error = new Error("Test error");
                        request.onerror({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.getAllTags();

            expect(result).toEqual([]);
        });
    });

    describe("addTag", () => {
        it("should add a new tag to the database", async () => {
            const mockTag: TagDictionaryItem = {
                tagId: "00100010",
                name: "Patient Name",
                vr: "PN",
            };

            // Mock that tag does not exist yet
            mockObjectStore.get.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                request.result = null;
                setTimeout(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.addTag(mockTag);

            expect(result).toBe(true);
            expect(mockObjectStore.get).toHaveBeenCalledWith(mockTag.tagId);
            expect(mockObjectStore.add).toHaveBeenCalledWith(mockTag);
        });

        it("should not add a tag if it already exists", async () => {
            const mockTag: TagDictionaryItem = {
                tagId: "00100010",
                name: "Patient Name",
                vr: "PN",
            };

            // Mock that tag already exists
            mockObjectStore.get.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                request.result = mockTag;
                setTimeout(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.addTag(mockTag);

            expect(result).toBe(false);
            expect(mockObjectStore.get).toHaveBeenCalledWith(mockTag.tagId);
            expect(mockObjectStore.add).not.toHaveBeenCalled();
        });
    });

    describe("updateTag", () => {
        it("should update an existing tag", async () => {
            const mockTag: TagDictionaryItem = {
                tagId: "00100010",
                name: "Updated Patient Name",
                vr: "PN",
            };

            // Mock that tag exists
            mockObjectStore.get.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                request.result = { ...mockTag, name: "Patient Name" };
                setTimeout(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.updateTag(mockTag);

            expect(result).toBe(true);
            expect(mockObjectStore.get).toHaveBeenCalledWith(mockTag.tagId);
            expect(mockObjectStore.put).toHaveBeenCalledWith(mockTag);
        });

        it("should fail if tag does not exist", async () => {
            const mockTag: TagDictionaryItem = {
                tagId: "00100010",
                name: "Patient Name",
                vr: "PN",
            };

            // Mock that tag doesn't exist
            mockObjectStore.get.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                request.result = null;
                setTimeout(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.updateTag(mockTag);

            expect(result).toBe(false);
            expect(mockObjectStore.get).toHaveBeenCalledWith(mockTag.tagId);
            expect(mockObjectStore.put).not.toHaveBeenCalled();
        });
    });

    describe("removeTag", () => {
        it("should remove a tag from the database", async () => {
            const tagId = "00100010";

            const result = await tagDictionaryDB.removeTag(tagId);

            expect(result).toBe(true);
            expect(mockObjectStore.delete).toHaveBeenCalledWith(tagId);
        });

        it("should handle errors during tag removal", async () => {
            const tagId = "00100010";

            // Mock error during delete
            mockObjectStore.delete.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                setTimeout(() => {
                    if (request.onerror) {
                        request.error = new Error("Test error");
                        request.onerror({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.removeTag(tagId);

            expect(result).toBe(false);
        });
    });

    describe("resetToDefaults", () => {
        it("should reset the dictionary to default values", async () => {
            // Setup mocks for the addTag method that will be called for each standard element
            const addTagSpy = jest
                .spyOn(tagDictionaryDB, "addTag")
                .mockResolvedValue(true);

            const result = await tagDictionaryDB.resetToDefaults();

            expect(result).toBe(true);
            expect(mockObjectStore.clear).toHaveBeenCalled();

            // Check that addTag was called for each standard element
            const standardElementCount =
                Object.keys(standardDataElements).length;
            expect(addTagSpy).toHaveBeenCalledTimes(standardElementCount);
        });

        it("should handle errors during reset", async () => {
            // Mock error during clear
            mockObjectStore.clear.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                setTimeout(() => {
                    if (request.onerror) {
                        request.error = new Error("Test error");
                        request.onerror({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.resetToDefaults();

            expect(result).toBe(false);
        });
    });

    describe("getTag", () => {
        it("should retrieve a tag by ID", async () => {
            const mockTag: TagDictionaryItem = {
                tagId: "00100010",
                name: "Patient Name",
                vr: "PN",
            };

            // Mock that tag exists
            mockObjectStore.get.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                request.result = mockTag;
                setTimeout(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.getTag(mockTag.tagId);

            expect(result).toEqual(mockTag);
            expect(mockObjectStore.get).toHaveBeenCalledWith(mockTag.tagId);
        });

        it("should return null if tag is not found", async () => {
            const tagId = "00100010";

            // Mock that tag doesn't exist
            mockObjectStore.get.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                request.result = null;
                setTimeout(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.getTag(tagId);

            expect(result).toBeNull();
        });
    });

    describe("exportTagDictionary", () => {
        it("should export the tag dictionary as a JSON file", async () => {
            const mockTags: TagDictionaryItem[] = [
                { tagId: "00100010", name: "Patient Name", vr: "PN" },
                { tagId: "00100020", name: "Patient ID", vr: "LO" },
            ];

            // Mock getAllTags to return test data
            jest.spyOn(tagDictionaryDB, "getAllTags").mockResolvedValueOnce(
                mockTags
            );

            const result = await tagDictionaryDB.exportTagDictionary();

            expect(result).toBe(true);
            expect(global.URL.createObjectURL).toHaveBeenCalled();
            expect(document.createElement).toHaveBeenCalledWith("a");
            expect(document.body.appendChild).toHaveBeenCalled();
            expect(document.body.removeChild).toHaveBeenCalled();
            expect(global.URL.revokeObjectURL).toHaveBeenCalled();
        });

        it("should return false if no tags are found", async () => {
            // Mock getAllTags to return empty array
            jest.spyOn(tagDictionaryDB, "getAllTags").mockResolvedValueOnce([]);

            const result = await tagDictionaryDB.exportTagDictionary();

            expect(result).toBe(false);
        });
    });

    describe("importTagDictionary", () => {
        it("should import tags from a JSON file", async () => {
            const mockTags: TagDictionaryItem[] = [
                { tagId: "00100010", name: "Patient Name", vr: "PN" },
                { tagId: "00100020", name: "Patient ID", vr: "LO" },
            ];

            // Mock file reading
            jest.spyOn(
                tagDictionaryDB as any,
                "readFileAsText"
            ).mockResolvedValueOnce(JSON.stringify(mockTags));

            // Mock getAllTags to return different tags
            jest.spyOn(tagDictionaryDB, "getAllTags").mockResolvedValueOnce([
                { tagId: "00100030", name: "Patient Birth Date", vr: "DA" },
            ]);

            const mockFile = new File([], "tags.json");
            const result = await tagDictionaryDB.importTagDictionary(mockFile);

            expect(result.success).toBe(true);
            expect(result.count).toBe(mockTags.length);
            expect(mockObjectStore.put).toHaveBeenCalledTimes(mockTags.length);
        });

        it("should reject invalid JSON format", async () => {
            // Mock file reading with invalid JSON
            jest.spyOn(
                tagDictionaryDB as any,
                "readFileAsText"
            ).mockResolvedValueOnce("not valid json");

            const mockFile = new File([], "tags.json");
            const result = await tagDictionaryDB.importTagDictionary(mockFile);

            expect(result.success).toBe(false);
            expect(result.count).toBe(0);
        });

        it("should reject non-array data", async () => {
            // Mock file reading with non-array data
            jest.spyOn(
                tagDictionaryDB as any,
                "readFileAsText"
            ).mockResolvedValueOnce('{"key": "value"}');

            const mockFile = new File([], "tags.json");
            const result = await tagDictionaryDB.importTagDictionary(mockFile);

            expect(result.success).toBe(false);
            expect(result.count).toBe(0);
        });

        it("should reject array with invalid tag objects", async () => {
            // Mock file reading with array of invalid objects
            jest.spyOn(
                tagDictionaryDB as any,
                "readFileAsText"
            ).mockResolvedValueOnce('[{"invalid": "object"}]');

            const mockFile = new File([], "tags.json");
            const result = await tagDictionaryDB.importTagDictionary(mockFile);

            expect(result.success).toBe(false);
            expect(result.count).toBe(0);
        });
    });

    describe("deleteDatabase", () => {
        it("should delete the database successfully", async () => {
            // Mock successful database deletion
            mockIndexedDB.deleteDatabase.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                setTimeout(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                }, 0);
                return request;
            });

            // Set db to non-null to test closing
            (tagDictionaryDB as any).db = mockDB;

            const result = await tagDictionaryDB.deleteDatabase();

            expect(result).toBe(true);
            expect(mockDB.close).toHaveBeenCalled();
            expect(mockIndexedDB.deleteDatabase).toHaveBeenCalledWith(
                "TagDictionaryDB"
            );
        });

        it("should handle errors during database deletion", async () => {
            // Mock error during database deletion
            mockIndexedDB.deleteDatabase.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                setTimeout(() => {
                    if (request.onerror) {
                        request.error = new Error("Test error");
                        request.onerror({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.deleteDatabase();

            expect(result).toBe(false);
        });

        it("should handle blocked database deletion", async () => {
            // Mock blocked database deletion
            mockIndexedDB.deleteDatabase.mockImplementationOnce(() => {
                const request = { ...mockSuccessRequest };
                setTimeout(() => {
                    if (request.onblocked) {
                        request.onblocked({ target: request });
                    }
                }, 0);
                return request;
            });

            const result = await tagDictionaryDB.deleteDatabase();

            expect(result).toBe(false);
        });
    });
});
