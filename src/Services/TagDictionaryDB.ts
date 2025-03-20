import { standardDataElements } from "@dataFunctions/TagDictionary/standardDataElements";
import logger from "@logger/Logger";

// Define the tag structure
export interface TagDictionaryItem {
    tagId: string;
    name: string;
    vr: string;
}

const DB_NAME = "TagDictionaryDB";
const STORE_NAME = "tags";
const DB_VERSION = 1;

/**
 * Service for managing tag dictionary in IndexedDB
 */
export class TagDictionaryDB {
    private db: IDBDatabase | null = null;

    /**
     * Initialize the database connection
     * @returns Promise that resolves when the database is ready
     */
    async initDB(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onupgradeneeded = (event) => {
                    const db = (event.target as IDBOpenDBRequest).result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        const store = db.createObjectStore(STORE_NAME, {
                            keyPath: "tagId",
                        });
                        store.createIndex("name", "name", { unique: false });
                    }
                };

                request.onsuccess = (event) => {
                    this.db = (event.target as IDBOpenDBRequest).result;
                    logger.info(
                        "TagDictionary IndexedDB initialized successfully"
                    );
                    resolve(true);
                };

                request.onerror = (event) => {
                    logger.error(
                        "Error opening TagDictionary IndexedDB:",
                        (event.target as IDBOpenDBRequest).error
                    );
                    resolve(false);
                };
            } catch (error) {
                logger.error(
                    "IndexedDB not supported or error occurred:",
                    error
                );
                resolve(false);
            }
        });
    }

    /**
     * Loads all tags from the database
     * @returns Promise with all tags
     */
    async getAllTags(): Promise<TagDictionaryItem[]> {
        if (!this.db) {
            await this.initDB();
            if (!this.db) {
                logger.error("IndexedDB not available, returning empty array");
                return [];
            }
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                logger.error(
                    "Error getting tags from DB:",
                    (event.target as IDBRequest).error
                );
                reject((event.target as IDBRequest).error);
            };
        });
    }

    /**
     * Add a new tag to the dictionary
     * @param tag Tag to add
     * @returns Promise indicating success
     */
    async addTag(tag: TagDictionaryItem): Promise<boolean> {
        if (!this.db) {
            await this.initDB();
            if (!this.db) return false;
        }

        return new Promise((resolve) => {
            try {
                const transaction = this.db!.transaction(
                    STORE_NAME,
                    "readwrite"
                );
                const store = transaction.objectStore(STORE_NAME);

                // Check if tag already exists
                const getRequest = store.get(tag.tagId);

                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        // Tag already exists
                        logger.info(
                            `Tag ${tag.tagId} already exists in dictionary`
                        );
                        resolve(false);
                        return;
                    }

                    // Add the new tag
                    const addRequest = store.add(tag);

                    addRequest.onsuccess = () => {
                        logger.info(`Added tag ${tag.tagId} to dictionary`);
                        resolve(true);
                    };

                    addRequest.onerror = (event) => {
                        logger.error(
                            "Error adding tag:",
                            (event.target as IDBRequest).error
                        );
                        resolve(false);
                    };
                };

                getRequest.onerror = (event) => {
                    logger.error(
                        "Error checking tag existence:",
                        (event.target as IDBRequest).error
                    );
                    resolve(false);
                };
            } catch (error) {
                logger.error("Error in addTag:", error);
                resolve(false);
            }
        });
    }

    /**
     * Update an existing tag in the dictionary
     * @param tag Updated tag data
     * @returns Promise indicating success
     */
    async updateTag(tag: TagDictionaryItem): Promise<boolean> {
        if (!this.db) {
            await this.initDB();
            if (!this.db) return false;
        }

        return new Promise((resolve) => {
            try {
                const transaction = this.db!.transaction(
                    STORE_NAME,
                    "readwrite"
                );
                const store = transaction.objectStore(STORE_NAME);

                // First check if the tag exists
                const getRequest = store.get(tag.tagId);

                getRequest.onsuccess = () => {
                    if (!getRequest.result) {
                        logger.error(
                            `Tag ${tag.tagId} does not exist to update`
                        );
                        resolve(false);
                        return;
                    }

                    // Update the tag
                    const updateRequest = store.put(tag);

                    updateRequest.onsuccess = () => {
                        logger.info(`Updated tag ${tag.tagId}`);
                        resolve(true);
                    };

                    updateRequest.onerror = (event) => {
                        logger.error(
                            "Error updating tag:",
                            (event.target as IDBRequest).error
                        );
                        resolve(false);
                    };
                };

                getRequest.onerror = (event) => {
                    logger.error(
                        "Error checking tag existence:",
                        (event.target as IDBRequest).error
                    );
                    resolve(false);
                };
            } catch (error) {
                logger.error("Error in updateTag:", error);
                resolve(false);
            }
        });
    }

    /**
     * Remove a tag from the dictionary
     * @param tagId ID of the tag to remove
     * @returns Promise indicating success
     */
    async removeTag(tagId: string): Promise<boolean> {
        if (!this.db) {
            await this.initDB();
            if (!this.db) return false;
        }

        return new Promise((resolve) => {
            try {
                const transaction = this.db!.transaction(
                    STORE_NAME,
                    "readwrite"
                );
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(tagId);

                request.onsuccess = () => {
                    logger.info(`Removed tag ${tagId} from dictionary`);
                    resolve(true);
                };

                request.onerror = (event) => {
                    logger.error(
                        "Error removing tag:",
                        (event.target as IDBRequest).error
                    );
                    resolve(false);
                };
            } catch (error) {
                logger.error("Error in removeTag:", error);
                resolve(false);
            }
        });
    }

    /**
     * Reset the dictionary to default values from standardDataElements
     * @returns Promise indicating success
     */
    async resetToDefaults(): Promise<boolean> {
        if (!this.db) {
            await this.initDB();
            if (!this.db) return false;
        }

        return new Promise((resolve) => {
            try {
                const transaction = this.db!.transaction(
                    STORE_NAME,
                    "readwrite"
                );
                const store = transaction.objectStore(STORE_NAME);

                // Clear existing data
                const clearRequest = store.clear();

                clearRequest.onsuccess = async () => {
                    logger.info("Cleared tag dictionary database");

                    // Add all standard data elements
                    let success = true;
                    const entries = Object.entries(standardDataElements);

                    for (const [tagId, data] of entries) {
                        const tag: TagDictionaryItem = {
                            tagId,
                            name: data.name,
                            vr: data.vr,
                        };

                        const added = await this.addTag(tag);
                        if (!added) {
                            success = false;
                        }
                    }

                    logger.info(
                        `Reset dictionary with ${entries.length} default tags`
                    );
                    resolve(success);
                };

                clearRequest.onerror = (event) => {
                    logger.error(
                        "Error clearing tag dictionary:",
                        (event.target as IDBRequest).error
                    );
                    resolve(false);
                };
            } catch (error) {
                logger.error("Error in resetToDefaults:", error);
                resolve(false);
            }
        });
    }

    /**
     * Get a single tag by ID
     * @param tagId ID of the tag to retrieve
     * @returns Promise with the tag or null if not found
     */
    async getTag(tagId: string): Promise<TagDictionaryItem | null> {
        if (!this.db) {
            await this.initDB();
            if (!this.db) return null;
        }

        return new Promise((resolve) => {
            try {
                const transaction = this.db!.transaction(
                    STORE_NAME,
                    "readonly"
                );
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(tagId);

                request.onsuccess = () => {
                    resolve(request.result || null);
                };

                request.onerror = (event) => {
                    logger.error(
                        "Error getting tag:",
                        (event.target as IDBRequest).error
                    );
                    resolve(null);
                };
            } catch (error) {
                logger.error("Error in getTag:", error);
                resolve(null);
            }
        });
    }
}

// Create and export a singleton instance
export const tagDictionaryDB = new TagDictionaryDB();
