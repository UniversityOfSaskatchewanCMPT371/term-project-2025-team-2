import React from "react";
import { NestedTagRow } from "../Navingation/NestedTagRow.tsx";

interface DicomTableRowProps {
    row: {
        tagId: string;
        tagName: string;
        value: string | any[];
    };
    index: number;
}

export const DicomTableRow: React.FC<DicomTableRowProps> = ({ row, index }) => {
    return (
        <>
            <tr key={index + row.tagId}>
                <td className="border px-4 py-2">{row.tagId}</td>
                <td className="border px-4 py-2">{row.tagName}</td>
                <td className="border px-4 py-2">
                    {Array.isArray(row.value) ? "" : row.value}
                </td>
            </tr>
            {Array.isArray(row.value)
                ? row.value.map((nestedRow: any, nestedIndex: number) => (
                      <NestedTagRow
                          key={nestedRow.tagId + nestedIndex}
                          nestedRow={nestedRow}
                          index={nestedIndex}
                      />
                  ))
                : null}
        </>
    );
};
