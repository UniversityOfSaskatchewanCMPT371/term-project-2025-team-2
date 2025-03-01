import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { DicomTableRowProps } from "../../../types/DicomTypes";

/**
 * handleClick function
 * @description - Allows user to input new value for the row
 */
const handleClick = (
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsEditing(true);
};

/**
 * DicomTableRow component
 * @param DicomTableRowProps - row, index, onUpdateValue, nested, updated, level
 * @returns rendered DicomTableRow component
 */
export const DicomTableRow: React.FC<DicomTableRowProps> = ({
    row,
    index,
    onUpdateValue,
    nested,
    updated,
    level = 0,
}) => {
    const [newValue, setNewValue] = useState<string>(row.value as string);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [edited, setEdited] = useState<boolean>(updated || false);
    const [deleteTag, setDeleteTag] = useState<boolean>(false);

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewValue(e.target.value);
        setEdited(true);
    };

    const handleBlur = () => {
        onUpdateValue(row.tagId, newValue, deleteTag);
        setIsEditing(false);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const toggleDelete = () => {
        setDeleteTag((preValue) => !preValue);
        const tempDeletetag = !deleteTag;

        onUpdateValue(row.tagId, newValue, tempDeletetag);
    };

    return (
        <React.Fragment key={index + row.tagId + row.value}>
            <tr
                key={index + row.tagId}
                className={`hover:bg-blue-600 ${deleteTag && "outline -outline-offset-4 outline-red-600"}`}
            >
                <td
                    className={`break-all border px-4 py-2 ${
                        nested
                            ? `bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-black dark:bg-blue-500`
                            : ""
                    }`}
                    style={{
                        paddingLeft: `${nested ? 40 + level * 20 : 16}px`,
                    }}
                >
                    {typeof row.value !== "string" && (
                        <span
                            className="mr-2 inline-block cursor-pointer text-white transition-colors hover:text-blue-200"
                            onClick={toggleExpand}
                            style={{ width: "20px" }}
                        >
                            {isExpanded ? "▼" : "▶"}
                        </span>
                    )}
                    {nested && (
                        <span className="mr-2 inline-block h-2 w-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></span>
                    )}
                    {row.tagId}
                </td>
                <td className="break-all border px-4 py-2">{row.tagName}</td>
                <td className="break-all border px-4 py-2">
                    {typeof row.value === "string" ||
                    row.value instanceof String ? (
                        <div className="flex">
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={newValue}
                                        onChange={handleValueChange}
                                        onBlur={handleBlur}
                                        className="rounded border p-1"
                                    />
                                ) : edited ? (
                                    <span className="font-semibold text-red-600">
                                        {newValue}
                                    </span>
                                ) : (
                                    <span>{newValue}</span>
                                )}
                            </div>
                            <div
                                className="flex cursor-pointer justify-end hover:text-accent"
                                onClick={() => handleClick(toggleEditing)}
                            >
                                <PencilSquareIcon
                                    className="h-6 w-6"
                                    data-testid="edit-tag-button"
                                    data-tooltip-id={`${row.tagId}-editTag-button-tooltip`}
                                    data-tooltip-content="Edit Tag Value"
                                    data-tooltip-place="top"
                                    aria-label="Edit Tag"
                                />
                                <Tooltip
                                    id={`${row.tagId}-editTag-button-tooltip`}
                                />
                            </div>
                            <div
                                className="flex cursor-pointer justify-end hover:text-accent"
                                onClick={() => toggleDelete()}
                            >
                                <XCircleIcon
                                    className={`ml-4 h-6 w-6 ${deleteTag && "text-red-600"}`}
                                    data-tooltip-id={`${row.tagId}-deleteTag-button-tooltip`}
                                    data-tooltip-content={
                                        deleteTag
                                            ? "Undo Delete"
                                            : "To Be Deleted"
                                    }
                                    data-tooltip-place="left"
                                    aria-label={
                                        deleteTag ? "Undo Delete" : "Delete Tag"
                                    }
                                />
                                <Tooltip
                                    id={`${row.tagId}-deleteTag-button-tooltip`}
                                />
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </td>
            </tr>
            {typeof row.value !== "string" && isExpanded
                ? Object.values(row.value.tags).map((nested: any) => (
                      <DicomTableRow
                          key={nested.tagId}
                          row={nested}
                          index={index}
                          onUpdateValue={onUpdateValue}
                          nested
                          level={(level || 0) + 1}
                      />
                  ))
                : null}
        </React.Fragment>
    );
};
