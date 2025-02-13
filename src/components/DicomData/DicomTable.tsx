import React, { useState } from "react";
import Search from "../utils/Search";
import { DicomTableRow } from "./DicomTableRow.tsx";
import { DicomTableProps } from "../../types/types.ts";
import { GenButton } from "../utils/GenButton.tsx";
import log from "../utils/Logger";

/**
 *
 * @param dicomData - DICOM data, extracted from a DICOM file
 * @returns rendered DicomTable component
 */
const DicomTable: React.FC<DicomTableProps> = ({
    dicomData,
    fileName,
    updateTableData,
    newTableData,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showHidden, setShowHidden] = useState(false);

    if (!dicomData) {
        log.error("No DICOM data available");
        return <div>No data available</div>;
    }

    const rows = Object.entries(dicomData).map(([tagId, tagData]) => ({
        tagId,
        tagName: tagData.tagName,
        value:
            newTableData.find(
                (row: any) => row.fileName === fileName && row.tagId === tagId
            )?.newValue || tagData.value,
        hidden: tagData.hidden || false,
        updated: newTableData.find(
            (row: any) => row.fileName === fileName && row.tagId === tagId
        )?.newValue
            ? true
            : false,
    }));

    const filteredRows = rows.filter(
        (row) =>
            row.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.tagName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (Array.isArray(row.value)
                ? row.value.some(
                      (nestedRow: any) =>
                          nestedRow.tagId
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                          nestedRow.tagName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                  )
                : row.value
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()))
    );

    const handleUpdateValue = (tagId: string, newValue: string) => {
        updateTableData({
            fileName: fileName,
            tagId: tagId,
            newValue: newValue,
        });
    };

    const toggleHiddenTags = () => {
        setShowHidden(!showHidden);
    };

    // placeholder for updating the file
    const updateFile = () => {
        console.log(dicomData);
        console.log(newTableData);
    };

    return (
        <div key={fileName} className="mt-8">
            <h2 className="text-2xl font-semibold">DICOM Tags</h2>
            <div className="flex-col-2 flex">
                <Search
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
                <div className="ml-4">
                    <GenButton
                        label="Save Edits"
                        disabled={false}
                        onClick={updateFile}
                    />
                </div>
                <div className="ml-4">
                    <GenButton
                        label={
                            showHidden ? "Hide Hidden Tags" : "Show Hidden Tags"
                        }
                        disabled={false}
                        onClick={toggleHiddenTags}
                    />
                </div>
            </div>
            <table
                className="mt-4 min-w-full table-auto border-collapse"
                style={{ tableLayout: "fixed", width: "100%" }}
            >
                <thead>
                    <tr className="text-wrap bg-primary">
                        <th className="w-1/7 border px-4 py-2 text-primary-content">
                            Tag
                        </th>
                        <th className="w-1/4 border px-4 py-2 text-primary-content">
                            Tag Name
                        </th>
                        <th className="w-7/12 border px-4 py-2 text-primary-content">
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRows.length > 0 ? (
                        filteredRows.map((row, index) =>
                            row.hidden && !showHidden ? null : (
                                <DicomTableRow
                                    key={index + row.tagId}
                                    row={row}
                                    index={index}
                                    onUpdateValue={handleUpdateValue}
                                    updated={row.updated}
                                />
                            )
                        )
                    ) : (
                        <tr>
                            <td
                                colSpan={3}
                                className="border px-4 py-2 text-center"
                            >
                                No matching tags found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DicomTable;
