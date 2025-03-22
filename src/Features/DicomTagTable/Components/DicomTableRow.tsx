import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import {
    PencilSquareIcon,
    XCircleIcon,
    ArrowUturnLeftIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { DicomTableRowProps, DicomTag } from "../Types/DicomTypes";
import { useStore } from "@state/Store";
import logger from "@logger/Logger";

const lockEditingTags: string[] = [
    "X00080016",
    "X00080018",
    "X00200032",
    "X00200037",
    "X0025101B",
    "X00431028",
    "X00431029",
    "X0043102A",
    "X7FE00010",
    "X00020002",
    "X00020003",
    "X00020010",
];

/**
 * handleClick function
 * @description - Allows user to input new value for the row
 * @precondition - User clicks on the edit button
 * @postcondition - User can input new value for the row
 * @param setIsEditing - setEditing state
 * @returns void
 */
const handleClick = (
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsEditing(true);
};

/**
 * DicomTableRow component
 * @component
 * @description - Renders a single row in the DICOM table
 * @precondition - DicomTableRow component expects the following props
 * @postcondition - Renders a single row in the DICOM table
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

    const hideTagNumber = useStore((state) => state.hideTagNumber);
    const allowEditLockedTags = useStore((state) => state.allowEditLockedTags);

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewValue(e.target.value);
        setEdited(true);
        logger.debug(`Changed value to ${e.target.value}`);
    };

    const handleBlur = () => {
        onUpdateValue(row.tagId, newValue, deleteTag);
        setIsEditing(false);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        logger.debug(`Toggled expand for tag with tagId: ${row.tagId}`);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
        logger.debug(`Toggled editing for tag with tagId: ${row.tagId}`);
    };

    const toggleDelete = () => {
        setDeleteTag((preValue) => !preValue);
        const tempDeletetag = !deleteTag;

        logger.debug(
            `Delete set to ${tempDeletetag}, tag with tagId: ${row.tagId}`
        );

        onUpdateValue(row.tagId, newValue, tempDeletetag);
    };

    logger.debug("Rendering DicomTableRow component");

    return (
        <React.Fragment key={index + row.tagId + row.value}>
            <tr
                key={index + row.tagId}
                className={`${
                    deleteTag &&
                    "bg-red-100 text-red-500 opacity-50 hover:bg-red-400"
                } ${edited ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-400" : "hover:bg-blue-600"}`}
            >
                {!hideTagNumber && (
                    <td
                        className={`break-all border px-4 py-2 ${
                            nested
                                ? `bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 text-black dark:bg-blue-500`
                                : ""
                        }`}
                        style={{
                            paddingLeft: `${nested ? 40 + level * 20 : 16}px`,
                        }}
                    >
                        {typeof row.value !== "string" && (
                            <span
                                className="mr-2 inline-block cursor-pointer text-blue-600 transition-colors hover:text-blue-200"
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
                )}

                <td className="border px-4 py-2">{row.tagName}</td>

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
                                        className="w-full rounded border border-primary p-1"
                                    />
                                ) : edited ? (
                                    <span className="text-yellow-700">
                                        {newValue}
                                        <span className="ml-2 text-xs italic">
                                            (pending)
                                        </span>
                                    </span>
                                ) : deleteTag ? (
                                    <span className="text-red-500">
                                        {newValue}
                                        <span className="ml-2 text-xs italic">
                                            (Pending deletion)
                                        </span>
                                    </span>
                                ) : (
                                    <span>{newValue}</span>
                                )}
                            </div>
                            {lockEditingTags.includes(row.tagId) &&
                            !allowEditLockedTags ? null : !deleteTag ? (
                                isEditing ? (
                                    <>
                                        <CheckCircleIcon
                                            className="ml-2 mt-1 h-6 w-6 cursor-pointer hover:scale-110 hover:text-success"
                                            onClick={toggleEditing}
                                            data-tooltip-id={`save-tag-${row.tagId}`}
                                            data-tooltip-content="Save update"
                                            data-tooltip-place="left"
                                        />
                                        <Tooltip id={`save-tag-${row.tagId}`} />
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className="flex cursor-pointer justify-end hover:text-accent"
                                            onClick={() =>
                                                handleClick(toggleEditing)
                                            }
                                        >
                                            <PencilSquareIcon
                                                className="ml-4 h-6 w-6"
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
                                            onClick={toggleDelete}
                                        >
                                            <XCircleIcon
                                                className={`ml-4 h-6 w-6 hover:text-red-500`}
                                                data-tooltip-id={`${row.tagId}-deleteTag-button-tooltip`}
                                                data-tooltip-content={
                                                    "Delete Tag"
                                                }
                                                data-tooltip-place="left"
                                                aria-label="Delete Tag"
                                            />
                                            <Tooltip
                                                id={`${row.tagId}-deleteTag-button-tooltip`}
                                            />
                                        </div>
                                    </>
                                )
                            ) : (
                                <div
                                    className="flex cursor-pointer justify-end hover:text-accent"
                                    onClick={() => toggleDelete()}
                                >
                                    <ArrowUturnLeftIcon
                                        className="h-6 w-6"
                                        data-tooltip-id={`${row.tagId}-undo-delete-button-tooltip`}
                                        data-tooltip-content="Undo Delete"
                                        data-tooltip-place="left"
                                        aria-label="Undo Delete"
                                    />
                                    <Tooltip
                                        id={`${row.tagId}-undo-delete-button-tooltip`}
                                    />
                                </div>
                            )}
                        </div>
                    ) : null}
                </td>
            </tr>

            {/* Render nested rows for sequences */}
            {isExpanded &&
                (() => {
                    // Case 1: row.value is an array (multiple sequence items)
                    if (Array.isArray(row.value)) {
                        return row.value.map(
                            (
                                nestedItem: { tags?: Record<string, DicomTag> },
                                i: number
                            ) =>
                                nestedItem?.tags
                                    ? Object.values(nestedItem.tags).map(
                                          (nested: DicomTag) => (
                                              <DicomTableRow
                                                  key={`${nested.tagId}-${i}`}
                                                  row={nested}
                                                  index={index}
                                                  onUpdateValue={onUpdateValue}
                                                  nested
                                                  level={level + 1}
                                              />
                                          )
                                      )
                                    : null
                        );
                    }
                    // Case 2: row.value is a single nested tag object
                    if (typeof row.value === "object" && row.value?.tags) {
                        return Object.values(row.value.tags).map(
                            (nested: DicomTag) => (
                                <DicomTableRow
                                    key={nested.tagId}
                                    row={nested}
                                    index={index}
                                    onUpdateValue={onUpdateValue}
                                    nested
                                    level={level + 1}
                                />
                            )
                        );
                    }

                    return null;
                })()}
        </React.Fragment>
    );
};
