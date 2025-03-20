import React, { useState, useEffect } from "react";
// import { Tooltip } from "react-tooltip";
import {
    PencilSquareIcon,
    XCircleIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/solid";

/**
 * DicomTableRow component
 * @component
 * @description - Renders a single row in the DICOM table
 * @precondition - DicomTableRow component expects the following props
 * @postcondition - Renders a single row in the DICOM table
 * @param DicomTableRowProps - row, index, onUpdateValue, nested, updated, level
 * @returns rendered DicomTableRow component
 */
interface TagDictTableRowProps {
    tagId: string;
    index: number;
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
    index,
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
        onUpdateValue(tagId, "", true);
    };

    // Render different styling based on pending status
    const rowClassName = isPendingDelete
        ? "bg-red-100 opacity-50"
        : pendingValue !== undefined && pendingValue !== value
          ? "bg-yellow-100"
          : index % 2 === 0
            ? "bg-base-100"
            : "bg-base-200";

    return (
        <tr className={rowClassName}>
            <td className="border px-4 py-2 text-center">
                <div className="flex-col-2 flex">
                    <div className="mr-2">{index + 1}.</div>
                    <div>{tagId}</div>
                </div>
            </td>
            <td className="border px-4 py-2">{tagVR}</td>
            <td className="border px-4 py-2 text-center">
                {canEdit ? (
                    <div className="flex items-center">
                        <input
                            type="text"
                            className="mr-4 w-full"
                            value={updatedValue}
                            onChange={handleChange}
                        />
                        <CheckCircleIcon
                            className="h-6 w-6 cursor-pointer hover:scale-110 hover:text-success"
                            onClick={handleSave}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div>
                            {isPendingDelete ? (
                                <span className="italic text-red-500">
                                    Pending deletion
                                </span>
                            ) : pendingValue !== undefined &&
                              pendingValue !== value ? (
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
                            <PencilSquareIcon
                                className="h-6 w-6 cursor-pointer hover:scale-110 hover:text-primary"
                                onClick={() => setCanEdit(true)}
                            />
                            <XCircleIcon
                                className="ml-2 h-6 w-6 cursor-pointer hover:scale-110 hover:text-error"
                                onClick={handleDelete}
                            />
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
}
