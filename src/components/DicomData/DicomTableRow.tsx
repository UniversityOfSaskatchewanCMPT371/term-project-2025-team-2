import React, { useState } from "react";

/**
 * interface DicomTableRowProps
 */
export interface DicomTableRowProps {
    row: {
        tagId: string;
        tagName: string;
        value: string | any[];
    };
    index: number;
    onUpdateValue: (tagId: string, newValue: string) => void;
    nested?: boolean;
}

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
 *
 * @param row - DICOM tag row, containing tag ID, tag name, and value
 * @returns rendered DicomTableRow component
 */
export const DicomTableRow: React.FC<DicomTableRowProps> = ({
    row,
    index,
    onUpdateValue,
    nested,
}) => {
    const [newValue, setNewValue] = useState<string>(row.value as string);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [edited, setEdited] = useState<boolean>(false);

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewValue(e.target.value);
        setEdited(true);
    };

    const handleBlur = () => {
        onUpdateValue(row.tagId, newValue);
        setIsEditing(false);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    return (
        <>
            <tr key={index + row.tagId}>
                <td
                    className={`break-all border px-4 py-2 ${nested ? "bg-blue-400" : ""}`}
                >
                    <span
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={toggleExpand}
                    >
                        {typeof row.value !== "string" &&
                            (isExpanded ? "▼" : "▶")}
                    </span>
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                </svg>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </td>
            </tr>
            {typeof row.value !== "string" && isExpanded
                ? Object.values(row.value).map((nested: any) => (
                      <DicomTableRow
                          key={nested.tagId}
                          row={nested}
                          index={index}
                          onUpdateValue={onUpdateValue}
                          nested
                      />
                  ))
                : null}
        </>
    );
};
