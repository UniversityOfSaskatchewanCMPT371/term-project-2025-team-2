import { useMemo } from "react";
import logger from "@logger/Logger";

/**
 * Custom hook for filtering DICOM table rows
 * @function
 * @precondition useFilteredRows hook expects the following parameters
 * @postcondition Returns filtered array of table rows
 * @param {TableRow[]} rows - Array of table rows to filter
 * @param {string} searchTerm - Current search term
 * @returns {TableRow[]} Filtered array of table rows
 */
export const useFilteredRows = (rows: any[], searchTerm: string) => {
    logger.debug(`Filtering rows with search term: ${searchTerm}`);
    logger.debug(`Rows length: ${rows.length}`);

    return useMemo(
        () =>
            rows.filter(
                (row) =>
                    row.tagId
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    row.tagName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    // (Array.isArray(row.value)
                    //     ? row.value.some(
                    //         (nestedRow: any) =>
                    //             nestedRow.tagId
                    //                 .toLowerCase()
                    //                 .includes(searchTerm.toLowerCase()) ||
                    //             nestedRow.tagName
                    //                 .toLowerCase()
                    //                 .includes(searchTerm.toLowerCase())
                    //     )
                    //     :
                    row.value
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                // )
            ),
        [rows, searchTerm]
    );
};
