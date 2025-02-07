import React from "react";

interface NestedTagRowProps {
    nestedRow: { tagId: string; tagName: string; value: string };
    index: number;
}

export const NestedTagRow: React.FC<NestedTagRowProps> = ({
    nestedRow,
    index,
}) => {
    return (
        <tr key={nestedRow.tagId + index}>
            <td className="border bg-blue-200 px-4 py-2">{nestedRow.tagId}</td>
            <td className="border px-4 py-2">{nestedRow.tagName}</td>
            <td className="border px-4 py-2">{nestedRow.value}</td>
        </tr>
    );
};
