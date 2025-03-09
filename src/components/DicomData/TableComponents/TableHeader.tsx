import React from "react";

/**
 * Table header component for DICOM data
 * @component
 * @returns {JSX.Element} The rendered table header
 */
export const TableHeader: React.FC = () => (
    <thead>
        <tr className="text-wrap bg-primary">
            <th className="w-1/7 border px-4 py-2 text-primary-content">Tag</th>
            <th className="w-1/4 border px-4 py-2 text-primary-content">
                Tag Name
            </th>
            <th className="w-7/12 border px-4 py-2 text-primary-content">
                Value
            </th>
        </tr>
    </thead>
);
