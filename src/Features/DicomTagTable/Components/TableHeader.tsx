import React from "react";
import { useStore } from "@state/Store";
import logger from "@logger/Logger";

/**
 * Table header component for DICOM data
 * @component
 * @precondition TableHeader component expects no props
 * @postcondition Renders the table header for the DICOM data
 * @returns {JSX.Element} The rendered table header
 */
export const TableHeader: React.FC = () => {
    const hideTagNumber = useStore((state) => state.hideTagNumber);

    logger.debug("Rendering TableHeader component");
    return (
        <thead>
            <tr className="text-wrap bg-primary">
                {hideTagNumber ? null : (
                    <th className="w-1/7 border px-4 py-2 text-primary-content">
                        Tag
                    </th>
                )}
                {/* <th className="w-1/7 border px-4 py-2 text-primary-content">Tag</th> */}
                <th className="w-1/4 border px-4 py-2 text-primary-content">
                    Tag Name
                </th>
                <th className="w-7/12 border px-4 py-2 text-primary-content">
                    Value
                </th>
            </tr>
        </thead>
    );
};
