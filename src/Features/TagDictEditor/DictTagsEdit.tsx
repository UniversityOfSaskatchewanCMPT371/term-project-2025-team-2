import { useStore } from "@state/Store";
import logger from "@logger/Logger";
import { useState, useEffect } from "react";
import { TagDictionaryTable } from "./TagDictionaryTable";
import { TagDictionaryItem } from "../../Services/TagDictionaryDB";

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

    const setShowAlert = useStore((state) => state.setShowAlert);
    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setAlertType = useStore((state) => state.setAlertType);

    const [tagId, setTagId] = useState<string>("");
    const [tagName, setTagName] = useState<string>("");
    const [tagVR, setTagVR] = useState<string>("");
    const [showAddTag, setShowAddTag] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Store pending changes before applying them to the database
    const [pendingChanges, setPendingChanges] = useState<
        Map<string, TagDictionaryItem>
    >(new Map());

    // Load tag dictionary on component mount if not already loaded
    useEffect(() => {
        if (!isTagDictionaryLoaded) {
            loadTagDictionary();
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
            vr: tagVR,
        });

        if (success) {
            setTagId("");
            setTagName("");
            setTagVR("");
            setShowAddTag(false);
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
                <button
                    onClick={async () => {
                        await resetTagDictionary();
                        setShowAddTag(false);
                        setPendingChanges(new Map());
                    }}
                    className="rounded-full bg-error px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Reset Tags
                </button>
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
