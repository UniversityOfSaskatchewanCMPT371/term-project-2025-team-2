import React from "react";

/**
 * Empty table row component
 * @component
 * @returns {React.FunctionComponent}
 */
const EmptyTableRow: React.FC = () => (
    <tr>
        <td colSpan={3} className="border px-4 py-2 text-center">
            No matching tags found
        </td>
    </tr>
);

export default EmptyTableRow;
