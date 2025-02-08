import React, { useState } from "react";
import { SearchInput } from "../utils/SearchInput.tsx";
import { DicomTableRow } from "./DicomTableRow.tsx";
import { DicomTableProps } from "../../types/types.ts";

const DicomTable: React.FC<DicomTableProps> = ({ dicomData }) => {
    const [searchTerm, setSearchTerm] = useState("");

    if (!dicomData) {
        return <div>No data available</div>;
    }

    const rows = Object.entries(dicomData).map(([tagId, tagData]) => ({
        tagId,
        tagName: tagData.tagName,
        value: tagData.value,
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
                : row.value.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold">DICOM Tags</h2>
            <SearchInput
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <table className="mt-4 min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-wrap">
                        <th className="border px-4 py-2 text-wrap">Tag</th>
                        <th className="border px-4 py-2 text-wrap">Tag Name</th>
                        <th className="border px-4 py-2 text-wrap">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRows.length > 0 ? (
                        filteredRows.map((row, index) => (
                            <DicomTableRow
                                key={index + row.tagId}
                                row={row}
                                index={index}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-4 py-2 text-center">
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
