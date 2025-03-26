import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import {
    PencilSquareIcon,
    XCircleIcon,
    CheckCircleIcon,
    ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";

/**
 * TagDictTableRow component
 * @component
 * @description - Renders a single row in the tag dictionary table
 * @precondition - TagDictTableRow component expects the following props
 * @postcondition - Renders a single row in the tag dictionary table
 * @param TagDictTableRowProps - tagId, index, tagName, tagVR, onUpdateValue, isPendingDelete, pendingValue
 * @returns rendered TagDictTableRow component
 */
interface TagDictTableRowProps {
    tagId: string;
    tagName: string;
    tagVR?: string;
    onUpdateValue: (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => void;
    isPendingDelete?: boolean;
    pendingValue?: string;
}

export function TagDictTableRow({
    tagId,
    tagName,
    tagVR = "",
    onUpdateValue,
    isPendingDelete = false,
    pendingValue,
}: TagDictTableRowProps) {
    const [canEdit, setCanEdit] = useState(false);
    const [value, setValue] = useState(tagName);
    const [updatedValue, setUpdatedValue] = useState(tagName);

    // Update local state when pendingValue changes
    useEffect(() => {
        if (pendingValue !== undefined) {
            setUpdatedValue(pendingValue);
        }
    }, [pendingValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedValue(e.target.value);
    };

    const handleSave = () => {
        setValue(updatedValue);
        onUpdateValue(tagId, updatedValue, false);
        setCanEdit(false);
    };

    const handleDelete = () => {
        // Toggle deletion status
        if (isPendingDelete) {
            // If already marked for deletion, restore it
            onUpdateValue(tagId, value, false);
        } else {
            // Mark for deletion
            onUpdateValue(tagId, "", true);
        }
    };

    // Render different styling based on pending status
    const rowClassName = isPendingDelete
        ? "bg-red-100 opacity-50 hover:bg-red-400 text-red-500"
        : pendingValue !== undefined && pendingValue !== tagName
          ? "bg-yellow-100 hover:bg-yellow-400 text-yellow-700"
          : "bg-base-100 hover:bg-blue-600";

    return (
        <tr className={rowClassName}>
            <td className="border px-4 py-2 text-center">
                <div className="flex-col-2 flex">
                    <div>X</div>
                    <div>{tagId}</div>
                </div>
            </td>
            <td className="border px-4 py-2">{tagVR}</td>
            <td className="text-wrap break-words border px-4 py-2 text-center">
                {canEdit ? (
                    <div className="flex items-center">
                        <input
                            type="text"
                            className="mr-4 w-full text-wrap break-words border border-primary"
                            value={updatedValue}
                            onBlur={handleSave}
                            onChange={handleChange}
                        />
                        <CheckCircleIcon
                            className="h-6 w-6 cursor-pointer hover:scale-110 hover:text-success"
                            onClick={handleSave}
                            data-tooltip-id={`save-tag-${tagId}`}
                            data-tooltip-content="Save update"
                            data-tooltip-place="left"
                        />
                        <Tooltip id={`save-tag-${tagId}`} />
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div>
                            {isPendingDelete ? (
                                <span className="text-red-500">
                                    {value}
                                    <span className="ml-2 text-xs italic">
                                        (Pending deletion)
                                    </span>
                                </span>
                            ) : pendingValue !== undefined &&
                              pendingValue !== tagName ? (
                                <span className="text-yellow-700">
                                    {pendingValue}
                                    <span className="ml-2 text-xs italic">
                                        (pending)
                                    </span>
                                </span>
                            ) : (
                                value
                            )}
                        </div>
                        <div className="flex">
                            {!isPendingDelete && (
                                <>
                                    <PencilSquareIcon
                                        className="h-6 w-6 cursor-pointer hover:scale-110 hover:text-primary"
                                        onClick={() => setCanEdit(true)}
                                        data-tooltip-id={`edit-tag-${tagId}`}
                                        data-tooltip-content="Edit tag name"
                                        data-tooltip-place="left"
                                    />
                                    <Tooltip id={`edit-tag-${tagId}`} />
                                </>
                            )}
                            {isPendingDelete ? (
                                <ArrowUturnLeftIcon
                                    className="ml-2 h-6 w-6 cursor-pointer hover:scale-110 hover:text-success"
                                    onClick={handleDelete}
                                    data-tooltip-id={`delete-tag-${tagId}`}
                                    data-tooltip-content="Undo delete tag"
                                    data-tooltip-place="left"
                                />
                            ) : (
                                <XCircleIcon
                                    className="ml-2 h-6 w-6 cursor-pointer hover:scale-110 hover:text-error"
                                    onClick={handleDelete}
                                    data-tooltip-id={`delete-tag-${tagId}`}
                                    data-tooltip-content="Delete tag"
                                    data-tooltip-place="left"
                                />
                            )}
                            <Tooltip id={`delete-tag-${tagId}`} />
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
}
