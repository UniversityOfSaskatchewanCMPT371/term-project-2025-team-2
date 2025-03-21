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
                            name: data.name.replace(/([a-z])([A-Z])/g, '$1 $2').trim(),
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

    /**
     * Export the current tag dictionary as a downloadable JSON file
     * @description - Exports all tags from the dictionary to a JSON file that users can download
     * @precondition - IndexedDB must be initialized and contain tag data
     * @postcondition - A JSON file containing all tag dictionary data is downloaded to the user's device
     * @returns Promise indicating whether the export was successful
     */
    async exportTagDictionary(): Promise<boolean> {
        if (!this.db) {
            await this.initDB();
            if (!this.db) {
                logger.error(
                    "Cannot export tag dictionary: database not initialized"
                );
                return false;
            }
        }

        try {
            // Get all tags from the database
            const tags = await this.getAllTags();

            if (tags.length === 0) {
                logger.warn("No tags found in dictionary to export");
                return false;
            }

            // Convert the tags to a JSON string with pretty formatting
            const tagsJson = JSON.stringify(tags, null, 2);

            // Create a Blob with the JSON data
            const blob = new Blob([tagsJson], { type: "application/json" });

            // Create a download URL
            const url = URL.createObjectURL(blob);

            // Create a link element to trigger the download
            const link = document.createElement("a");
            link.href = url;
            link.download = `dicom-tag-dictionary-${new Date().toISOString().split("T")[0]}.json`;

            // Append to the document, click it, and clean up
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Release the URL object
            URL.revokeObjectURL(url);

            logger.info(`Exported ${tags.length} tags from dictionary`);
            return true;
        } catch (error) {
            logger.error("Error exporting tag dictionary:", error);
            return false;
        }
    }

    /**
     * Import tags from a JSON file
     * @description - Imports tags from an uploaded JSON file into the dictionary
     * @precondition - The JSON file must contain valid tag dictionary data
     * @postcondition - Tags in the file will be imported, replacing existing ones with the same ID
     * @returns Promise indicating whether the import was successful
     */
    async importTagDictionary(
        file: File
    ): Promise<{ success: boolean; count: number }> {
        if (!this.db) {
            await this.initDB();
            if (!this.db) {
                logger.error(
                    "Cannot import tag dictionary: database not initialized"
                );
                return { success: false, count: 0 };
            }
        }

        try {
            // Read the file contents
            const fileContents = await this.readFileAsText(file);

            // Parse the JSON data
            let tagsToImport: TagDictionaryItem[];
            try {
                tagsToImport = JSON.parse(fileContents);

                // Validate the data structure
                if (!Array.isArray(tagsToImport)) {
                    logger.error("Invalid tag dictionary format: not an array");
                    return { success: false, count: 0 };
                }

                // Validate each tag has the required properties
                const isValid = tagsToImport.every(
                    (tag) =>
                        typeof tag === "object" &&
                        tag !== null &&
                        typeof tag.tagId === "string" &&
                        typeof tag.name === "string" &&
                        typeof tag.vr === "string"
                );

                if (!isValid) {
                    logger.error(
                        "Invalid tag dictionary format: missing required properties"
                    );
                    return { success: false, count: 0 };
                }
            } catch (parseError) {
                logger.error("Error parsing tag dictionary JSON:", parseError);
                return { success: false, count: 0 };
            }

            // Get the current tags to preserve those not in the import
            const currentTags = await this.getAllTags();
            const currentTagIds = new Set(currentTags.map((tag) => tag.tagId));

            // Track import statistics
            let importCount = 0;
            let errorCount = 0;

            // Start a transaction for the import
            const transaction = this.db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);

            // Process each tag to import
            for (const tag of tagsToImport) {
                try {
                    // Remove the tag from the set of current tags
                    currentTagIds.delete(tag.tagId);

                    // Use put to replace existing tags
                    const request = store.put(tag);

                    // Wait for each operation to complete
                    await new Promise<void>((resolve) => {
                        request.onsuccess = () => {
                            importCount++;
                            resolve();
                        };

                        request.onerror = (event) => {
                            logger.warn(
                                `Error importing tag ${tag.tagId}:`,
                                (event.target as IDBRequest).error
                            );
                            errorCount++;
                            resolve(); // Continue with next tag
                        };
                    });
                } catch (tagError) {
                    logger.warn(`Error processing tag ${tag.tagId}:`, tagError);
                    errorCount++;
                }
            }

            logger.info(
                `Imported ${importCount} tags, with ${errorCount} errors`
            );
            return { success: importCount > 0, count: importCount };
        } catch (error) {
            logger.error("Error importing tag dictionary:", error);
            return { success: false, count: 0 };
        }
    }

    /**
     * Helper function to read a file as text
     * @param file - The file to read
     * @returns Promise resolving to the file contents as string
     */
    private readFileAsText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                if (event.target && typeof event.target.result === "string") {
                    resolve(event.target.result);
                } else {
                    reject(new Error("Failed to read file as text"));
                }
            };

            reader.onerror = () => {
                reject(reader.error);
            };

            reader.readAsText(file);
        });
    }

    /**
     * Completely delete the database from the local machine
     * @description - Permanently removes the entire IndexedDB database for tag dictionary
     * @returns Promise indicating whether the deletion was successful
     */
    async deleteDatabase(): Promise<boolean> {
        // Close the database connection if it's open
        if (this.db) {
            this.db.close();
            this.db = null;
        }

        return new Promise((resolve) => {
            try {
                const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

                deleteRequest.onsuccess = () => {
                    logger.info(`Successfully deleted ${DB_NAME} database`);
                    resolve(true);
                };

                deleteRequest.onerror = (event) => {
                    logger.error(
                        `Error deleting ${DB_NAME} database:`,
                        (event.target as IDBOpenDBRequest).error
                    );
                    resolve(false);
                };

                // Handle edge case where database doesn't exist
                deleteRequest.onblocked = () => {
                    logger.warn(
                        `Database deletion blocked. Ensure all connections are closed.`
                    );
                    resolve(false);
                };
            } catch (error) {
                logger.error(`Failed to delete ${DB_NAME} database:`, error);
                resolve(false);
            }
        });
    }
}

// Create and export a singleton instance
export const tagDictionaryDB = new TagDictionaryDB();
