import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { TagDictTableRow } from "./TagDictTableRow";
import { TagDictionaryItem } from "../../Services/TagDictionaryDB";

// Define the props interface for the TagDictionaryTable component
export interface TagDictionaryTableProps {
    showAddTag: boolean;
    addtag: (tagId: string, tagVR: string) => void;
    tagId: string;
    tagVR: string;
    tagName: string;
    setTagId: React.Dispatch<React.SetStateAction<string>>;
    setTagName: React.Dispatch<React.SetStateAction<string>>;
    setTagVR: React.Dispatch<React.SetStateAction<string>>;
    addChanges: (tagId: string, newValue: string, deleteTag: boolean) => void;
    searchQuery: string;
    tags: TagDictionaryItem[];
    pendingChanges?: Map<string, TagDictionaryItem>;
}

/**
 * Renders a table of tag dictionary entries with pagination and search filtering
 * @component
 * @param {TagDictionaryTableProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export const TagDictionaryTable = React.memo(
    ({
        showAddTag,
        addtag,
        tagId,
        tagVR,
        setTagId,
        setTagName,
        setTagVR,
        addChanges,
        searchQuery,
        tags,
        pendingChanges = new Map(),
    }: TagDictionaryTableProps) => {
        const [displayCount, setDisplayCount] = useState(50);

        // Filter tags based on search query
        const filteredTags = React.useMemo(() => {
            if (!searchQuery.trim()) {
                return tags;
            }

            const query = searchQuery.toLowerCase();
            return tags.filter((tag) => {
                return (
                    tag.tagId.toLowerCase().includes(query) ||
                    tag.name.toLowerCase().includes(query)
                );
            });
        }, [tags, searchQuery]);

        const loadMoreRows = () => {
            setDisplayCount((prevCount) =>
                Math.min(prevCount + 50, filteredTags.length)
            );
        };

        return (
            <table className="m-4 mb-10 mb-24 border text-lg text-base-content">
                <thead>
                    <tr className="text-wrap bg-primary">
                        <th className="w-1/5 border px-4 py-2 text-primary-content">
                            Tag ID
                        </th>
                        <th className="w-2/5 border px-4 py-2 text-primary-content">
                            Tag VR
                        </th>
                        <th className="w-2/5 border px-4 py-2 text-primary-content">
                            Tag Name
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-base-100">
                    {showAddTag ? (
                        <tr>
                            <td className="border px-4 py-2 text-center">
                                <div className="flex-col-2 flex">
                                    <div className="mr-2">X</div>
                                    <input
                                        type="text"
                                        className="w-full"
                                        placeholder="Tag ID"
                                        maxLength={8}
                                        onChange={(e) => {
                                            setTagId(e.target.value);
                                        }}
                                    />
                                </div>
                            </td>
                            <td className="border px-4 py-2 text-center">
                                <div className="flex-col-2 flex">
                                    <input
                                        type="text"
                                        className="mr-4 w-full"
                                        placeholder="Tag VR"
                                        value={tagVR}
                                        onChange={(e) =>
                                            setTagVR(e.target.value)
                                        }
                                    />
                                </div>
                            </td>
                            <td className="border px-4 py-2 text-center">
                                <div className="flex-col-2 flex">
                                    <input
                                        type="text"
                                        className="mr-4 w-full"
                                        placeholder="Tag Name"
                                        onChange={(e) =>
                                            setTagName(e.target.value)
                                        }
                                    />
                                    <CheckCircleIcon
                                        data-testid="CheckCircleIcon"
                                        className="h-6 w-6 cursor-pointer hover:scale-110 hover:text-success"
                                        onClick={() => addtag(tagId, tagVR)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ) : null}

                    {filteredTags.slice(0, displayCount).map((tag, index) => {
                        // Check if there's a pending change for this tag
                        const pendingChange = pendingChanges.get(tag.tagId);
                        const isPendingDelete =
                            pendingChange && (pendingChange as any)._delete;

                        return (
                            <TagDictTableRow
                                key={tag.tagId}
                                tagId={tag.tagId}
                                index={index}
                                tagName={tag.name}
                                tagVR={tag.vr}
                                onUpdateValue={addChanges}
                                isPendingDelete={isPendingDelete}
                                pendingValue={
                                    pendingChange && !isPendingDelete
                                        ? pendingChange.vr
                                        : undefined
                                }
                            />
                        );
                    })}

                    {displayCount < filteredTags.length && (
                        <tr>
                            <td colSpan={3} className="py-2 text-center">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={loadMoreRows}
                                >
                                    Load More (
                                    {filteredTags.length - displayCount}{" "}
                                    remaining)
                                </button>
                            </td>
                        </tr>
                    )}

                    {filteredTags.length === 0 && (
                        <tr>
                            <td
                                colSpan={3}
                                className="py-4 text-center text-base-content"
                            >
                                {searchQuery
                                    ? "No tags match your search query"
                                    : "No tags available. Add some tags to get started."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
);
