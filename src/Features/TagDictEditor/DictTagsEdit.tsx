import { useStore } from "@state/Store";
import logger from "@logger/Logger";
import { useState, useEffect, useRef } from "react";
import { TagDictionaryTable } from "./TagDictionaryTable";
import {
    TagDictionaryItem,
    TagDictionaryDB,
} from "../../Services/TagDictionaryDB";
import {
    TrashIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

/**
 * Side panel for showing and editing tags to be anonymized
 * @component
 * @precondition SidePanel component expects the following props
 * @postcondition SidePanel component renders a side panel for showing and editing tags to be anonymized
 * @returns {JSX.Element} The rendered side panel
 */
export default function DictTagsEdit() {
    const setShowDictEdit = useStore((state) => state.setShowDictEdit);
    const showDictEdit = useStore((state) => state.showDictEdit);

    // Get tag dictionary state and functions from the store
    const tagDictionary = useStore((state) => state.tagDictionary);
    const isTagDictionaryLoaded = useStore(
        (state) => state.isTagDictionaryLoaded
    );
    const loadTagDictionary = useStore((state) => state.loadTagDictionary);
    const addTagToDictionary = useStore((state) => state.addTagToDictionary);
    const updateTagInDictionary = useStore(
        (state) => state.updateTagInDictionary
    );
    const removeTagFromDictionary = useStore(
        (state) => state.removeTagFromDictionary
    );
    const resetTagDictionary = useStore((state) => state.resetTagDictionary);

    const setLoadingMsg = useStore((state) => state.setLoadingMsg);
    const setLoading = useStore((state) => state.setLoading);

    const setShowAlert = useStore((state) => state.setShowAlert);
    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setAlertType = useStore((state) => state.setAlertType);

    const [tagId, setTagId] = useState<string>("");
    const [tagName, setTagName] = useState<string>("");
    const [tagVR, setTagVR] = useState<string>("");
    const [showAddTag, setShowAddTag] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Reference to tag dictionary service for export functionality
    const tagDictionaryServiceRef = useRef<TagDictionaryDB | null>(null);

    // Store pending changes before applying them to the database
    const [pendingChanges, setPendingChanges] = useState<
        Map<string, TagDictionaryItem>
    >(new Map());

    // Add this to your existing state variables
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load tag dictionary on component mount if not already loaded
    useEffect(() => {
        if (!isTagDictionaryLoaded) {
            loadTagDictionary();
        }

        // Initialize tag dictionary service for export
        if (!tagDictionaryServiceRef.current) {
            tagDictionaryServiceRef.current = new TagDictionaryDB();
            tagDictionaryServiceRef.current.initDB();
        }
    }, [isTagDictionaryLoaded, loadTagDictionary]);

    const addChanges = (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => {
        logger.debug(`Adding tag change: ${tagId} ${newValue} ${deleteTag}`);

        // Update the pending changes
        const newChanges = new Map(pendingChanges);

        if (deleteTag) {
            newChanges.set(tagId, {
                tagId,
                name: "",
                value: "",
                _delete: true,
            } as any);
        } else {
            const existingTag = tagDictionary.find(
                (tag) => tag.tagId === tagId
            );
            if (existingTag) {
                newChanges.set(tagId, {
                    ...existingTag,
                    name: newValue,
                });
            }
        }

        setPendingChanges(newChanges);
    };

    const addtag = async (tagId: string, tagVR: string) => {
        logger.info(`Adding tag: ${tagId} ${tagVR} ${tagName}`);

        if (tagId.length !== 8 || isNaN(parseInt(tagId))) {
            setAlertType("alert-error");
            setAlertMsg("Tag ID has to be 8 numbers");
            setShowAlert(true);
            return;
        }

        if (tagName.length < 1) {
            setAlertType("alert-error");
            setAlertMsg("Tag Name can't be empty");
            setShowAlert(true);
            return;
        }

        const success = await addTagToDictionary({
            tagId,
            name: tagName,
            vr: tagVR.length > 0 ? tagVR : "SH",
        });

        if (success) {
            setTagId("");
            setTagName("");
            setTagVR("");
            setShowAddTag(false);
        } else {
            setAlertType("alert-error");
            setAlertMsg("Failed to add tag to dictionary");
            setShowAlert(true);
        }
    };

    const handleUpdateValue = async () => {
        logger.debug("Updating tag values");
        setShowAddTag(false);

        let successCount = 0;
        let failCount = 0;

        // Apply all pending changes
        for (const [tagId, change] of pendingChanges.entries()) {
            if ((change as any)._delete) {
                const success = await removeTagFromDictionary(tagId);
                if (success) successCount++;
                else failCount++;
            } else {
                const success = await updateTagInDictionary(change);
                if (success) successCount++;
                else failCount++;
            }
        }

        // Clear pending changes
        setPendingChanges(new Map());

        if (failCount === 0) {
            setAlertMsg(`Updates Saved (${successCount} changes)`);
            setAlertType("alert-success");
        } else {
            setAlertMsg(
                `Updates partially saved (${successCount} successes, ${failCount} failures)`
            );
            setAlertType("alert-warning");
        }
        setShowAlert(true);
    };

    /**
     * Export tag dictionary to a JSON file
     * @description - Exports the current tag dictionary to a downloadable JSON file
     * @precondition - Tag dictionary must be loaded and database initialized
     * @postcondition - Tag dictionary is exported to a JSON file
     */
    const handleExportDictionary = async () => {
        logger.info("Exporting tag dictionary");

        // First save any pending changes
        await handleUpdateValue();

        // Ensure service is initialized
        if (!tagDictionaryServiceRef.current) {
            tagDictionaryServiceRef.current = new TagDictionaryDB();
            await tagDictionaryServiceRef.current.initDB();
        }

        // Export the dictionary
        const success =
            await tagDictionaryServiceRef.current.exportTagDictionary();

        // Show alert based on result
        if (success) {
            setAlertMsg("Tag dictionary exported successfully");
            setAlertType("alert-success");
        } else {
            setAlertMsg("Failed to export tag dictionary");
            setAlertType("alert-error");
        }
        setShowAlert(true);
    };

    /**
     * Handle importing tag dictionary from a file
     * @description - Reads and imports tags from a JSON file
     * @precondition - File must be a valid JSON file with tag data
     * @postcondition - Tags are imported and UI is updated
     */
    const handleImportDictionary = async () => {
        // Trigger file input click
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    /**
     * Process the selected import file
     * @description - Reads the selected file and imports the tags
     * @param e - The file input change event
     * @precondition - A valid JSON file must be selected
     * @postcondition - Tags are imported and UI is updated
     */
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoadingMsg("Importing tag dictionary...");
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 0));

        const file = files[0];
        // Only accept JSON files
        if (file.type !== "application/json" && !file.name.endsWith(".json")) {
            setAlertType("alert-error");
            setAlertMsg("Please select a valid JSON file");
            setLoading(false);
            setShowAlert(true);
            return;
        }

        try {
            // Ensure service is initialized
            if (!tagDictionaryServiceRef.current) {
                tagDictionaryServiceRef.current = new TagDictionaryDB();
                await tagDictionaryServiceRef.current.initDB();
            }

            // Import the dictionary
            const result =
                await tagDictionaryServiceRef.current.importTagDictionary(file);

            // Clear the file input value for future imports
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Show alert based on result
            if (result.success) {
                setAlertMsg(`Successfully imported ${result.count} tags`);
                setAlertType("alert-success");
                // Reload the tag dictionary to reflect changes
                loadTagDictionary();
            } else {
                setAlertMsg("Failed to import tag dictionary");
                setAlertType("alert-error");
            }
        } catch (error) {
            logger.error("Error during tag dictionary import:", error);
            setAlertMsg("An error occurred during import");
            setAlertType("alert-error");
        } finally {
            setLoading(false);
            setShowAlert(true);
        }
    };

    return (
        <div
            className={`fixed right-0 top-0 h-full w-3/4 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${
                showDictEdit ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="mb-5 mr-8 mt-24 flex items-center justify-between">
                <div className="ml-4 text-xl font-bold text-blue-400">
                    Edit Tag Dictionary
                </div>
                <div className="flex items-center">
                    <div className="relative mr-4">
                        <input
                            type="text"
                            placeholder="Search tags..."
                            className="input input-sm input-bordered w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setSearchQuery("")}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-4 flex justify-around">
                <button
                    onClick={() => {
                        handleUpdateValue();
                        setShowDictEdit(false);
                        setSearchQuery("");
                        setShowAddTag(false);
                    }}
                    className="rounded-full bg-success px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Save
                </button>
                <button
                    onClick={() => {
                        setShowAddTag(!showAddTag);
                    }}
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    {showAddTag ? "Close Add Tag" : "Add Tag to Dictionary"}
                </button>

                {/* Dropdown menu for dictionary actions */}
                <div className="dropdown dropdown-end mt-2 transition-all duration-200 hover:scale-105">
                    <label
                        tabIndex={0}
                        className="cursor-pointer rounded-full bg-secondary px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        Dictionary Options
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
                    >
                        <li>
                            <a
                                onClick={handleExportDictionary}
                                className="text-info"
                            >
                                <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5" />
                                Export Dictionary
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={handleImportDictionary}
                                className="text-info"
                            >
                                <ArrowUpTrayIcon className="mr-2 inline-block h-5 w-5" />
                                Import Dictionary
                            </a>
                        </li>
                        <li className="mt-2 border-t border-base-300 pt-2">
                            <a
                                onClick={async () => {
                                    await resetTagDictionary();
                                    setShowAddTag(false);
                                    setPendingChanges(new Map());
                                }}
                                className="text-error"
                            >
                                <TrashIcon className="mr-2 inline-block h-5 w-5" />
                                Reset Dictionary
                            </a>
                        </li>
                    </ul>
                </div>

                <button
                    onClick={() => {
                        setShowDictEdit(false);
                        setSearchQuery("");
                        setShowAddTag(false);
                        setPendingChanges(new Map());
                    }}
                    className="rounded-full bg-error px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Cancel
                </button>

                {/* Hidden file input for import */}
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleFileChange}
                    data-testid="file-input"
                />
            </div>

            {isTagDictionaryLoaded ? (
                <TagDictionaryTable
                    showAddTag={showAddTag}
                    addtag={addtag}
                    tagId={tagId}
                    tagName={tagName}
                    tagVR={tagVR}
                    setTagId={setTagId}
                    setTagName={setTagName}
                    setTagVR={setTagVR}
                    addChanges={addChanges}
                    searchQuery={searchQuery}
                    tags={tagDictionary}
                    pendingChanges={pendingChanges}
                />
            ) : (
                <div className="flex h-64 items-center justify-center">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            )}
        </div>
    );
}
